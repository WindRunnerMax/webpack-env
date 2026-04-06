import { IconSync } from "@arco-design/web-react/icon";
import type { DateTime } from "@block-kit/utils";
import { useMemoFn } from "@block-kit/utils/dist/es/hooks";
import type { FC } from "react";
import { useEffect, useState } from "react";

import type { FetchProps } from "../../api";
import { fetchStockKline } from "../../api";
import type { DailyKline } from "../../types/stock";
import type { DailyKlineChartProps } from "../candlestick";
import { DailyKlineChart } from "../candlestick";

export const BasicChart: FC<
  Omit<DailyKlineChartProps, "data"> & {
    title: string;
    /** 索引代码 */
    code: string;
    /** 开始日期 */
    start: DateTime;
    /** 结束日期 */
    end?: DateTime;
    source?: FetchProps["source"];
  }
> = props => {
  const { code, start, end, slice = 0, height = 200, width = "100%", source } = props;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DailyKline[]>([]);

  const fetchData = useMemoFn(async () => {
    try {
      setLoading(true);
      const result = await fetchStockKline({ code, start, end, source });
      setData(result);
    } catch (error) {
      console.error("Failed to fetch stock data:", error);
    } finally {
      setLoading(false);
    }
  });

  // 请求数据
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="part">
      <div className="title">
        <span>{props.title}</span>
        <span className="operation">
          <IconSync className="" onClick={fetchData} />
        </span>
      </div>
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
