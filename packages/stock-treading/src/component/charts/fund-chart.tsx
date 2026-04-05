import type { FC } from "react";
import { Fragment, useEffect, useState } from "react";

import { fetchStockKline } from "../../api";
import type { DailyKline } from "../../types/stock";
import type { DailyKlineChartProps } from "../daily-chart";
import { DailyKlineChart } from "../daily-chart";

export const FundChart: FC<
  Omit<DailyKlineChartProps, "data"> & {
    title: string;
    /** 索引代码 */
    code: string;
    /** 开始日期 - YYYYMMDD */
    start: string;
    /** 结束日期 - YYYYMMDD */
    end?: string;
  }
> = props => {
  const { code, start, end, slice = 0, height = 200, width = "100%" } = props;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DailyKline[]>([]);

  // 请求数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchStockKline({ code, start, end, source: "tencent-fund" });
        setData(result);
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [code, start, end, slice]);

  const worthData = data.map(item => ({
    ...item,
    close: item.worth!,
    open: item.worth!,
    high: item.worth!,
    low: item.worth!,
  }));

  return (
    <Fragment>
      <div className="part">
        <div className="title">{props.title + "(单位净值)"}</div>
        <div className="chart-container">
          {loading ? (
            <div style={{ width, height }}>加载中...</div>
          ) : (
            <DailyKlineChart data={worthData} slice={slice} height={height} width={width} />
          )}
        </div>
      </div>
      <div className="part">
        <div className="title">{props.title + "(累计净值)"}</div>
        <div className="chart-container">
          {loading ? (
            <div style={{ width, height }}>加载中...</div>
          ) : (
            <DailyKlineChart data={data} slice={slice} height={height} width={width} />
          )}
        </div>
      </div>
    </Fragment>
  );
};
