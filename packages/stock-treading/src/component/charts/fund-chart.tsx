import { IconSync } from "@arco-design/web-react/icon";
import type { DateTime } from "@block-kit/utils";
import { useMemoFn } from "@block-kit/utils/dist/es/hooks";
import type { FC } from "react";
import { Fragment, useEffect, useState } from "react";

import { fetchStockKline } from "../../api";
import type { DailyKline } from "../../types/stock";
import type { DailyKlineChartProps } from "../candlestick";
import { DailyKlineChart } from "../candlestick";

export const FundChart: FC<
  Omit<DailyKlineChartProps, "data"> & {
    title: string;
    /** 索引代码 */
    code: string;
    /** 开始日期 - YYYYMMDD */
    start: DateTime;
    /** 结束日期 - YYYYMMDD */
    end?: DateTime;
  }
> = props => {
  const { code, start, end, slice = 0, height = 200, width = "100%" } = props;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DailyKline[]>([]);

  const fetchData = useMemoFn(async () => {
    try {
      setLoading(true);
      const result = await fetchStockKline({ code, start, end, source: "tencent-fund" });
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
        <div className="title">
          <span>{props.title + "(单位净值)"}</span>
          <span className="operation">
            <IconSync className="" onClick={fetchData} />
          </span>
        </div>
        <div className="chart-container">
          {loading ? (
            <div style={{ width, height }}>加载中...</div>
          ) : (
            <DailyKlineChart data={worthData} slice={slice} height={height} width={width} />
          )}
        </div>
      </div>
      <div className="part">
        <div className="title">
          <span>{props.title + "(累计净值)"}</span>
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
    </Fragment>
  );
};
