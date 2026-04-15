// https://gu.qq.com/jj020602
// https://stockjs.finance.qq.com/fundUnitNavAll/data/year_all/020602.js

import { DateTime, isNil } from "@block-kit/utils";
import type { P } from "@block-kit/utils/dist/es/types";

import type { DailyKline } from "../types/stock";
import { getHeaders } from "../../shared/utils/request";

const baseUrl = "https://stockjs.finance.qq.com/fundUnitNavAll/data/year_all";

export const fetchTencentFund = async (
  index: string,
  source: "tencent-fund" | "tencent-fund-worth"
): Promise<DailyKline[]> => {
  const date = new DateTime().format();
  const res = await fetch(`${baseUrl}/${index}.js?${date}`, {
    headers: getHeaders(),
  });
  const text = await res.text();
  const data = JSON.parse(text.replace("fundNavAllYearData=", ""));
  return data.data.map((item: P.Any, index: number) => {
    // 日期, 单位净值, 历史净值
    const [date] = item;
    const lastItem = data.data[index - 1];
    const dataIndex = source === "tencent-fund" ? 2 : 1;
    const close = Number(item[dataIndex]);
    const lastClose = lastItem?.[dataIndex];
    return {
      date: date,
      open: Number(close),
      close: Number(close),
      high: Number(close),
      low: Number(close),
      change: !isNil(lastClose) ? ((close - lastClose) / lastClose) * 100 : 0,
    } as DailyKline;
  });
};
