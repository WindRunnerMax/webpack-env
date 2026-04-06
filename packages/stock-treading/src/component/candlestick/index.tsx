import type { ECharts } from "echarts";
import { init } from "echarts";
import React, { useEffect, useRef } from "react";

import type { DailyKline } from "../../types/stock";
import { getDailyChartConfig } from "./config";

export interface DailyKlineChartProps {
  /** 图表高度 */
  height?: number;
  /** 图表宽度 */
  width?: number | string;
  /** 裁剪数据 */
  slice?: number;
  /** 数据 */
  data: DailyKline[];
}

export const DailyKlineChart: React.FC<DailyKlineChartProps> = props => {
  const { height = 200, width = "100%", slice = 0, data } = props;
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;
    // 初始化图表
    if (!chartInstance.current) chartInstance.current = init(chartRef.current);
    // 配置选项
    const option = getDailyChartConfig(data, slice);
    chartInstance.current.setOption(option);
    // 响应式调整
    const handleResize = () => chartInstance.current?.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [data, slice]);

  useEffect(() => {
    return () => {
      chartInstance.current && chartInstance.current.dispose();
      chartInstance.current = null;
    };
  }, []);

  return <div ref={chartRef} style={{ width, height }} />;
};
