// https://www.csindex.com.cn/#/indices/family/detail?indexCode=H30269
// https://www.csindex.com.cn/csindex-home/perf/index-perf?indexCode=H30269&startDate=20260304&endDate=20260403

import type { DateTime } from "@block-kit/utils";
import { isNil } from "@block-kit/utils";
import type { P } from "@block-kit/utils/dist/es/types";

import type { DailyKline } from "../types/stock";
import { getHeaders } from "../utils/request";

const csIndexUrl = "https://www.csindex.com.cn/csindex-home/perf/index-perf";

export const fetchCsStock = async (
  index: string,
  startDate: DateTime,
  endDate: DateTime
): Promise<DailyKline[]> => {
  const start = startDate.format("yyyyMMdd");
  const end = endDate.format("yyyyMMdd");
  const res = await fetch(`${csIndexUrl}?indexCode=${index}&startDate=${start}&endDate=${end}`, {
    headers: getHeaders(),
  });
  const data = await res.json();
  return data.data.map((item: P.Any, index: number) => {
    const lastItem = data.data[index - 1];
    const lastClose = lastItem?.close;
    return {
      date: item.tradeDate,
      open: item.open ?? item.close,
      close: item.close,
      high: item.high ?? item.close,
      low: item.low ?? item.close,
      volume: item.tradingVol,
      change: !isNil(lastClose) ? ((item.close - lastClose) / lastClose) * 100 : 0,
    } as DailyKline;
  });
};
