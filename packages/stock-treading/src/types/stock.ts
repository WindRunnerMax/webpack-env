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
};
