import { DateTime } from "@block-kit/utils";
import type { O } from "@block-kit/utils/dist/es/types";

import { fetchSnowStock } from "../../stock/api/snow-stock";

export type DailyKline = {
  /** 日期 */
  date: string;
  /** 开盘价 */
  open: number;
  /** 收盘价 */
  close: number;
  /** 最高价 */
  high: number;
  /** 最低价 */
  low: number;
  /**
   * 涨跌幅(%)
   * - 相较昨日收盘价
   */
  change: number;
  /** 成交量 */
  volume?: number;
  /** 250 MA */
  ma: number;
};

export const alignKlineData = (start: string, base: DailyKline[], etf: DailyKline[]) => {
  const bMap: O.Map<DailyKline> = {};
  for (const b of base) {
    bMap[b.date] = b;
  }
  const eMap: O.Map<DailyKline> = {};
  for (const e of etf) {
    eMap[e.date] = e;
  }
  const now = Date.now();
  const b1: DailyKline[] = [];
  const e1: DailyKline[] = [];
  const s = new DateTime(start);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (s.getTime() > now) break;
    const date = s.format("yyyyMMdd");
    if (bMap[date] && eMap[date]) {
      b1.push(bMap[date]);
      e1.push(eMap[date]);
    }
    s.deferDay(1);
  }
  return [b1, e1];
};

export const fetchMeasureKline = async (code: string, start: string, ma: number) => {
  const s = new DateTime(start);
  s.nextDay(-ma);
  const res = await fetchSnowStock(code, s, new DateTime());
  const source = res as DailyKline[];
  let sum = 0;
  for (let i = 0; i < source.length; i++) {
    sum = sum + source[i].close;
    source[i].change = source[i].change / 100;
    if (i < ma - 1) {
      source[i].ma = 0;
      continue;
    }
    source[i].ma = sum / ma;
    sum = sum - source[i - ma + 1].close;
  }
  return source;
};
