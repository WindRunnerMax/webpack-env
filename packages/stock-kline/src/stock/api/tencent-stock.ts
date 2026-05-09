// https://gu.qq.com/sh512890
// https://proxy.finance.qq.com/cgi/cgi-bin/stockinfoquery/kline/app/get?code=sh512890&fromDate=2026-01-01&toDate=2026-12-31&ktype=day&limit=370

import { DateTime, isNil } from "@block-kit/utils";
import type { P } from "@block-kit/utils/dist/es/types";

import { getHeaders } from "../../shared/utils/request";
import type { DailyKline } from "../types/stock";

export const T_STOCK_URL = "https://proxy.finance.qq.com/cgi/cgi-bin/stockinfoquery/kline/app/get";

export const fetchTencentStock = async (
  index: string,
  startDate: DateTime,
  endDate: DateTime
): Promise<DailyKline[]> => {
  const s = startDate.format("yyyy-MM-dd");
  const e = endDate.format("yyyy-MM-dd");
  const res = await fetch(
    `${T_STOCK_URL}?code=${index}&fromDate=${s}&toDate=${e}&ktype=day&limit=${400}`,
    {
      headers: getHeaders(),
    }
  );
  const data = await res.json();
  return data.data.nodes.map((item: P.Any, index: number) => {
    const lastItem = data.data.nodes[index - 1];
    const lastClose = lastItem?.[1];
    return {
      date: new DateTime(item.date).format("yyyyMMdd"),
      open: Number(item.open ?? item.last),
      close: Number(item.last),
      high: Number(item.high ?? item.last),
      low: Number(item.low ?? item.last),
      change: !isNil(lastClose) ? ((item.last - lastClose) / lastClose) * 100 : 0,
    } as DailyKline;
  });
};
