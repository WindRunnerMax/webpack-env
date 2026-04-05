// https://gu.qq.com/jj020602
// https://stockjs.finance.qq.com/fundUnitNavAll/data/year_all/020602.js

import { isNil } from "@block-kit/utils";
import type { P } from "@block-kit/utils/dist/es/types";

import type { DailyKline } from "../types/stock";

const baseUrl = "https://stockjs.finance.qq.com/fundUnitNavAll/data/year_all";

export const fetchTencentFund = async (index: string): Promise<DailyKline[]> => {
  const res = await fetch(`${baseUrl}/${index}.js`);
  const text = await res.text();
  const data = JSON.parse(text.replace("fundNavAllYearData=", ""));
  return data.data.map((item: P.Any, index: number) => {
    // 日期, 单位净值, 历史净值
    const [date, worth, close] = item;
    const lastItem = data.data[index - 1];
    const lastClose = lastItem?.[1];
    return {
      date: date,
      open: Number(close),
      close: Number(close),
      high: Number(close),
      low: Number(close),
      worth: Number(worth),
      change: !isNil(lastClose) ? ((close - lastClose) / lastClose) * 100 : 0,
    };
  });
};
