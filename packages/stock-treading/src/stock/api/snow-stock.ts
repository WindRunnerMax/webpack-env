// https://xueqiu.com/S/SH512890
// https://stock.xueqiu.com/v5/stock/chart/kline.json?symbol=SH512890&begin=1775466294362&period=day&type=before&count=-284&indicator=kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance

import { DateTime, isNil, sleep } from "@block-kit/utils";
import type { F, P } from "@block-kit/utils/dist/es/types";

import { getHeaders } from "../../shared/utils/request";
import type { DailyKline } from "../types/stock";

export const SNOW_URL = "https://stock.xueqiu.com/v5/stock/chart/kline.json";

/** 全局登录锁 */
let resolveLock: F.Plain | null = null;
let promiseLock: Promise<void> | null = null;

const isLoggedIn = async () => {
  const a = await chrome.cookies.get({ url: "https://xueqiu.com", name: "xq_a_token" });
  const b = await chrome.cookies.get({ url: "https://xueqiu.com", name: "u" });
  return !!a && !!b;
};

const syncCookies = async () => {
  if (promiseLock) return promiseLock;
  promiseLock = new Promise(r => (resolveLock = r));
  let resolve!: F.Plain;
  let reject!: (s: string) => void;
  const p = new Promise<void>((r1, r2) => (resolve = r1) && (reject = r2));
  const iframe = document.createElement("iframe");
  iframe.src = "https://xueqiu.com";
  iframe.hidden = true;
  document.body.appendChild(iframe);
  let index = 0;
  const iframeCookieCheck = async () => {
    index++;
    const login = await isLoggedIn();
    if (login) {
      iframe.contentWindow?.close();
      iframe.src = "about:blank";
      sleep(1000).then(() => iframe.remove());
      resolveLock && resolveLock() && (promiseLock = null);
      return resolve();
    }
    if (index > 30) {
      iframe.remove();
      return reject("sync cookies timeout");
    }
    setTimeout(iframeCookieCheck, 1000);
  };
  iframeCookieCheck();
  return p;
};

export const fetchSnowStock = async (
  index: string,
  startDate: DateTime,
  endDate: DateTime
): Promise<DailyKline[]> => {
  const login = await isLoggedIn();
  if (!login) await syncCookies();
  let code = index;
  if (code.startsWith("H")) code = "S" + code;
  if (code.startsWith("Z")) code = "S" + code;
  const end = new DateTime(endDate.format("yyyy-MM-dd"));
  const timestamp = end.getTime();
  const diff = startDate.diff(endDate);
  const res = await fetch(
    `${SNOW_URL}?symbol=${code}&begin=${timestamp}&period=day&type=before&count=-${diff.days}&indicator=kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance`,
    {
      headers: getHeaders(),
    }
  );
  const data = await res.json();
  return data.data.item.map((item: P.Any, i: number) => {
    const [timestamp, , open, high, low, close] = item;
    const lastItem = data.data.item[i - 1];
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
