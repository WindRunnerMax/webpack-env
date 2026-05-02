import type { P } from "@block-kit/utils/dist/es/types";
import type { KLineData } from "klinecharts";

import { getHeaders } from "../../shared/utils/request";
import { isLoggedIn, SNOW_URL, syncCookies } from "../../stock/api/snow-stock";

export const getStockData = async (
  code: string,
  start: Date,
  offset: number,
  options?: {
    retry?: number;
  }
): Promise<KLineData[]> => {
  const { retry = 0 } = options ?? {};
  const login = await isLoggedIn();
  if (!login) await syncCookies();
  const res = await fetch(
    `${SNOW_URL}?symbol=${code}&begin=${start.getTime()}&period=day&type=before&count=${offset}&indicator=kline,pe,pb,ps,pcf,market_capital,agt,ggt,balance`,
    { headers: getHeaders() }
  );
  const data = await res.json();
  if (data.error_code !== 0 && retry < 2) {
    await syncCookies();
    return getStockData(code, start, offset, { retry: retry + 1 });
  }
  return data.data.item.map((item: P.Any) => {
    const [timestamp, , open, high, low, close] = item;
    return {
      timestamp: timestamp,
      open: open ?? close,
      close: close,
      high: high ?? close,
      low: low ?? close,
      volume: item[1] ? item[1] / 10000 / 100 : void 0,
    } as KLineData;
  });
};
