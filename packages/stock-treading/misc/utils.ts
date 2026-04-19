import type { O } from "@block-kit/utils/dist/es/types";

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

export const formatP = (num: number) => (num * 100).toFixed(4) + "%";

export const alignKline = (base: DailyKline[], etf: DailyKline[]) => {
  const bMap: O.Map<DailyKline> = {};
  for (const b of base) {
    bMap[b.date] = b;
  }
  const b1: DailyKline[] = [];
  const e1: DailyKline[] = [];
  for (const e of etf) {
    if (!bMap[e.date] || !e.ma || !bMap[e.date].ma) {
      continue;
    }
    b1.push(bMap[e.date]);
    e1.push(e);
  }
  return [b1, e1];
};
