// https://gu.qq.com/sh512890
// https://proxy.finance.qq.com/cgi/cgi-bin/stockinfoquery/kline/app/get?code=sh512890&fromDate=2026-01-01&toDate=2026-12-31&ktype=day&limit=370

import { DateTime } from "@block-kit/utils";
import type { P } from "@block-kit/utils/dist/es/types";

import type { DailyKline } from "../types/stock";

const baseUrl = "https://proxy.finance.qq.com/cgi/cgi-bin/stockinfoquery/kline/app/get";

export const tenStockFetch = async (
  index: string,
  startDate: string,
  endDate: string
): Promise<DailyKline[]> => {
  const start = new DateTime(startDate.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"));
  const end = new DateTime(endDate.replace(/^(\d{4})(\d{2})(\d{2})$/, "$1-$2-$3"));
  const s = start.format("yyyy-MM-dd");
  const e = end.format("yyyy-MM-dd");
  const res = await fetch(
    `${baseUrl}?code=${index}&fromDate=${s}&toDate=${e}&ktype=day&limit=${400}`
  );
  const data = await res.json();
  return data.data.nodes.map((item: P.Any, index: number) => {
    const lastItem = data.data[index - 1];
    return {
      date: new DateTime(item.date).format("yyyyMMdd"),
      open: Number(item.open ?? item.last),
      close: Number(item.last),
      high: Number(item.high ?? item.last),
      low: Number(item.low ?? item.last),
      change: lastItem ? ((item.last - lastItem.last) / lastItem.last) * 100 : 0,
    };
  });
};
