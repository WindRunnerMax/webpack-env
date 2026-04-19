import { useMemoFn } from "@block-kit/utils/dist/es/hooks";
import type { ECElementEvent, ECharts } from "echarts";
import { init } from "echarts";
import React, { useEffect, useMemo, useRef } from "react";

import type { DailyKline } from "../../types/stock";
import { getDailyChartOptions } from "./config";

export interface DailyKlineChartProps {
  /** 图表高度 */
  height?: number;
  /** 图表宽度 */
  width?: number | string;
  /** 裁剪数据 */
  slice?: number;
  /** 数据 */
  data: DailyKline[];
  /** 日均线 */
  ma?: number;
}

export const DailyKlineChart: React.FC<DailyKlineChartProps> = props => {
  const { height = 200, width = "100%", ma: maPreset = 250 } = props;
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts | null>(null);

  const { dates, klineData, maValues, data } = useMemo(() => {
    const slice = props.slice || 0;
    const source = props.data;
    const data = slice > 0 ? props.data.slice(-slice) : props.data;
    const dates = data.map(item => item.date);
    const klineData = data.map(item => [item.open, item.close, item.low, item.high]);
    let sum = 0;
    let maValues: (number | null)[] = [];
    for (let i = 0; i < source.length; i++) {
      sum = sum + source[i].close;
      if (i < maPreset - 1) {
        maValues.push(null);
        continue;
      }
      maValues.push(sum / maPreset);
      sum = sum - source[i - maPreset + 1].close;
    }
    maValues = slice > 0 ? maValues.slice(-slice) : maValues;
    return { data, dates, klineData, maValues };
  }, [props.data, props.slice, maPreset]);

  const onClickElement = useMemoFn((params: ECElementEvent) => {
    console.log("Candlestick:", params);
  });

  useEffect(() => {
    if (!chartInstance.current) {
      chartInstance.current = init(chartRef.current);
    }
    const chart = chartInstance.current;
    const handleResize = () => chart.resize();
    chart.on("click", onClickElement);
    window.addEventListener("resize", handleResize);
    return () => {
      chart.off("click", onClickElement);
      window.removeEventListener("resize", handleResize);
    };
  }, [onClickElement]);

  useEffect(() => {
    if (!chartInstance.current) return void 0;
    const option = getDailyChartOptions(data, dates, klineData, maValues, maPreset);
    chartInstance.current.setOption(option);
  }, [data, dates, klineData, maValues, maPreset]);

  useEffect(() => {
    return () => {
      chartInstance.current && chartInstance.current.dispose();
      chartInstance.current = null;
    };
  }, []);

  return <div className="chart-canvas" ref={chartRef} style={{ width, height }} />;
};
