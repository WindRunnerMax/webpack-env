import type { DailyKline } from "../types/stock";
import { csStockFetch } from "./cs-stock";
import { tenStockFetch } from "./ten-stock";

export type FetchProps = {
  /** 索引代码 */
  index: string;
  /**
   * 开始日期
   * - YYYYMMDD
   */
  start: string;
  /**
   * 结束日期
   * - YYYYMMDD
   */
  end: string;
  /**
   * 数据来源
   */
  source?: "cs" | "ten-stock" | "ten-fund";
};

export const fetchStockKline = async (props: FetchProps): Promise<DailyKline[]> => {
  const { index, start, end, source = "cs" } = props;
  if (source === "cs") {
    return csStockFetch(index, start, end);
  }
  if (source === "ten-stock") {
    return tenStockFetch(index, start, end);
  }
  throw new Error(`Unsupported source: ${source}`);
};
