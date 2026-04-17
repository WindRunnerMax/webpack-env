import "./index.less";

import { Select } from "@arco-design/web-react";
import { IconSync } from "@arco-design/web-react/icon";
import { DateTime } from "@block-kit/utils";
import { useMemoFn } from "@block-kit/utils/dist/es/hooks";
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";

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
    start?: DateTime;
    /** 结束日期 */
    end?: DateTime;
    ma?: number;
    source?: FetchProps["source"];
  }
> = props => {
  const { code, height = 200, width = "100%", source } = props;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DailyKline[]>([]);
  const sliding = useRef(props.slice || 0);
  const ma = useRef(props.ma || 250);

  const fetchData = useMemoFn(async () => {
    try {
      setLoading(true);
      const end = props.end || new DateTime();
      const start = props.start
        ? props.start
        : end.clone().deferDay(-sliding.current - ma.current * 2);
      const result = await fetchStockKline({
        code,
        start,
        end,
        source,
      });
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
          <Select
            size="mini"
            className="sliding-select"
            defaultValue={sliding.current}
            onChange={v => (sliding.current = v) && fetchData()}
            options={[
              { label: "100", value: 100 },
              { label: "200", value: 200 },
              { label: "300", value: 300 },
              { label: "400", value: 400 },
              { label: "500", value: 500 },
            ]}
          ></Select>
          <Select
            size="mini"
            className="ma-select"
            defaultValue={ma.current}
            onChange={v => (ma.current = v) && fetchData()}
            options={[
              { label: "200MA", value: 200 },
              { label: "250MA", value: 250 },
            ]}
          ></Select>
          <IconSync onClick={fetchData} />
        </span>
      </div>
      <div className="chart-container">
        {loading ? (
          <div style={{ width, height }}>加载中...</div>
        ) : (
          <DailyKlineChart
            data={data}
            slice={sliding.current}
            height={height}
            width={width}
            ma={ma.current}
          ></DailyKlineChart>
        )}
      </div>
    </div>
  );
};
