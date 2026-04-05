import type { FC } from "react";
import { useEffect, useState } from "react";

import type { FetchProps } from "../../api";
import { fetchStockKline } from "../../api";
import type { DailyKline } from "../../types/stock";
import type { DailyKlineChartProps } from "../daily-chart";
import { DailyKlineChart } from "../daily-chart";

export const BasicChart: FC<
  Omit<DailyKlineChartProps, "data"> & {
    title: string;
    /** 索引代码 */
    code: string;
    /** 开始日期 - YYYYMMDD */
    start: string;
    /** 结束日期 - YYYYMMDD */
    end?: string;
    source?: FetchProps["source"];
  }
> = props => {
  const { code, start, end, slice = 0, height = 200, width = "100%", source } = props;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DailyKline[]>([]);

  // 请求数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchStockKline({ code, start, end, source });
        setData(result);
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [code, start, end, slice, source]);

  return (
    <div className="part">
      <div className="title">{props.title}</div>
      <div className="chart-container">
        {loading ? (
          <div style={{ width, height }}>加载中...</div>
        ) : (
          <DailyKlineChart data={data} slice={slice} height={height} width={width} />
        )}
      </div>
    </div>
  );
};
