// https://xueqiu.com/S/SH512890
// https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=SH512890&begin=1775466294362&period=day&type=before&count=-284&indicator=kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance

import { DateTime, isNil } from "@block-kit/utils";
import type { P } from "@block-kit/utils/dist/es/types";

import type { DailyKline } from "../types/stock";
import { getHeaders } from "../utils/request";

const baseUrl = "https://stock.xueqiu.com/v5/stock/chart/kline.json";

const isLogin = async () => {
  const cookie = await chrome.cookies.get({ url: "https://xueqiu.com", name: "xq_a_token" });
  return !!cookie;
};

const syncCookies = async () => {
  return new Promise<void>((resolve, reject) => {
    const iframe = document.createElement("iframe");
    iframe.src = "https://xueqiu.com";
    iframe.hidden = true;
    document.body.appendChild(iframe);
    let index = 0;
    const iframeCookieCheck = async () => {
      index++;
      const login = await isLogin();
      if (login) {
        iframe.remove();
        return resolve();
      }
      if (index > 30) {
        iframe.remove();
        return reject("sync cookies timeout");
      }
      setTimeout(iframeCookieCheck, 1000);
    };
    iframeCookieCheck();
  });
};

export const fetchSnowStock = async (index: string, endDate: DateTime): Promise<DailyKline[]> => {
  const login = await isLogin();
  if (!login) await syncCookies();
  const start = new DateTime(endDate.format("yyyy-MM-dd"));
  const timestamp = start.getTime();
  const res = await fetch(
    `${baseUrl}?symbol=${index}&begin=${timestamp}&period=day&type=before&count=-${400}&indicator=kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance`,
    {
      headers: getHeaders(),
    }
  );
  const data = await res.json();
  return data.data.item.map((item: P.Any, index: number) => {
    const [timestamp, , open, high, low, close] = item;
    const lastItem = data.data.item[index - 1];
    const lastClose = lastItem?.[5];
    return {
      date: new DateTime(timestamp).format("yyyyMMdd"),
      open: open ?? close,
      close: close,
      high: high ?? close,
      low: low ?? close,
      volume: item[1] ? item[1] / 10000 / 100 : void 0,
      change: !isNil(lastClose) ? ((close - lastClose) / lastClose) * 100 : 0,
    } as DailyKline;
  });
};
