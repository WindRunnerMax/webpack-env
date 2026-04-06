import { DatePicker, Select } from "@arco-design/web-react";
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
    start: DateTime;
    /** 结束日期 */
    end?: DateTime;
    source?: FetchProps["source"];
  }
> = props => {
  const { code, end, height = 200, width = "100%", source } = props;
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DailyKline[]>([]);
  const start = useRef(props.start);
  const sliding = useRef(props.slice || 0);

  const fetchData = useMemoFn(async () => {
    try {
      setLoading(true);
      const result = await fetchStockKline({
        code,
        start: start.current,
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

  const handleStartDateChange = (date: string) => {
    start.current = new DateTime(date);
    fetchData();
  };

  return (
    <div className="part">
      <div className="title">
        <span>{props.title}</span>
        <span className="operation">
          <DatePicker
            defaultValue={start.current.getTime()}
            placeholder="起始日期"
            className="date-picker"
            size="mini"
            allowClear={false}
            onChange={handleStartDateChange}
          />
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
            ]}
          ></Select>
          <IconSync onClick={fetchData} />
        </span>
      </div>
      <div className="chart-container">
        {loading ? (
          <div style={{ width, height }}>加载中...</div>
        ) : (
          <DailyKlineChart data={data} slice={sliding.current} height={height} width={width} />
        )}
      </div>
    </div>
  );
};
