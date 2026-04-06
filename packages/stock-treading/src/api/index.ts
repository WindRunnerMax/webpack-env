import { DateTime } from "@block-kit/utils";

import type { DailyKline } from "../types/stock";
import { fetchCsStock } from "./cs-stock";
import { fetchSnowStock } from "./snow-stock";
import { fetchTencentFund } from "./tencent-fund";
import { fetchTencentStock } from "./tencent-stock";

export type FetchProps = {
  /** 索引代码 */
  code: string;
  /**
   * 开始日期
   * - YYYYMMDD
   */
  start: DateTime;
  /**
   * 结束日期
   * - YYYYMMDD
   */
  end?: DateTime;
  /**
   * 数据来源
   */
  source?: "cs" | "tencent-stock" | "tencent-fund-worth" | "tencent-fund" | "snow-stock";
};

export const fetchStockKline = async (props: FetchProps): Promise<DailyKline[]> => {
  const { code: code, start, end = new DateTime(), source = "cs" } = props;
  if (source === "cs") {
    return fetchCsStock(code, start, end);
  }
  if (source === "tencent-stock") {
    return fetchTencentStock(code, start, end);
  }
  if (source === "tencent-fund" || source === "tencent-fund-worth") {
    return fetchTencentFund(code, source);
  }
  if (source === "snow-stock") {
    return fetchSnowStock(code, end);
  }
  throw new Error(`Unsupported source: ${source}`);
};
