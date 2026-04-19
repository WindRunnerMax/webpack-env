import http from "node:http";

import { DateTime, isNil } from "@block-kit/utils";
import type { P } from "@block-kit/utils/dist/es/types";
import https from "https";
import { URL } from "url";

import { daysToWorkingDays } from "../src/shared/utils/date";
import type { DailyKline } from "./utils";

/**
(await chrome.cookies.get({ url: "https://xueqiu.com", name: "xq_a_token" })).value;
(await chrome.cookies.get({ url: "https://xueqiu.com", name: "u" })).value;
**/
const COOKIE = "xq_a_token=a8badf9f9f43e59da15a6e59e614356354714b45; u=711776491474726";

export const fetchKLine = (
  code: string,
  startDate: string,
  endDate: string,
  options?: {
    ma?: number;
  }
): Promise<DailyKline[]> => {
  const { ma: maPreset = 250 } = options || {};
  const end = new DateTime(endDate);
  const diff = new DateTime(startDate).diff(end);
  const offset = daysToWorkingDays(diff.days) + maPreset;
  const uri = `https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=${code}&begin=${end.getTime()}&period=day&type=before&count=-${offset}&indicator=kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance`;
  console.log("Fetch", uri);
  return new Promise((resolve, reject) => {
    const url = new URL(uri);
    const requestOptions = {
      method: "GET",
      hostname: url.hostname,
      port: url.port || (url.protocol === "https:" ? 443 : 80),
      path: url.pathname + url.search,
      headers: {
        Accept: "application/json",
        Cookie: COOKIE,
      },
    };

    const protocol = url.protocol === "https:" ? https : http;
    const req = protocol.request(requestOptions, res => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage || "Request failed"}`));
        return;
      }

      let rawData = "";
      res.setEncoding("utf8");
      res.on("data", chunk => {
        rawData = rawData + chunk;
      });
      res.on("end", () => {
        try {
          const parsedData = JSON.parse(rawData);
          const source: DailyKline[] = parsedData.data.item.map((item: P.Any, i: number) => {
            const [timestamp, , open, high, low, close] = item;
            const lastItem = parsedData.data.item[i - 1];
            const lastClose = lastItem?.[5];
            return {
              date: new DateTime(timestamp).format("yyyy-MM-dd"),
              open: open ?? close,
              close: close,
              high: high ?? close,
              low: low ?? close,
              volume: item[1] ? item[1] / 10000 / 100 : void 0,
              change: !isNil(lastClose) ? (close - lastClose) / lastClose : 0,
            };
          });
          let sum = 0;
          for (let i = 0; i < source.length; i++) {
            sum = sum + source[i].close;
            if (i < maPreset - 1) {
              source[i].ma = 0;
              continue;
            }
            source[i].ma = sum / maPreset;
            sum = sum - source[i - maPreset + 1].close;
          }
          resolve(source.slice(maPreset));
        } catch (err) {
          reject(new Error(`Invalid JSON: ${err}`));
        }
      });
    });

    req.on("error", err => {
      reject(new Error(`Request error: ${err.message}`));
    });

    req.end();
  });
};
