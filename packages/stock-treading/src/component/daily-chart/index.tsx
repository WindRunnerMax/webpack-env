import type { ECharts } from "echarts";
import { init } from "echarts";
import React, { useEffect, useRef, useState } from "react";

import type { FetchProps } from "../../api";
import { fetchStockKline } from "../../api";
import type { DailyKline } from "../../types/stock";
import { getDailyChartConfig } from "./config";

export interface DailyKlineChartProps {
  /** 索引代码 */
  index: string;
  /** 开始日期 - YYYYMMDD */
  start: string;
  /** 结束日期 - YYYYMMDD */
  end: string;
  /** 数据来源 */
  source?: FetchProps["source"];
  /** 图表高度 */
  height?: number;
  /** 图表宽度 */
  width?: number | string;
  /** 裁剪数据 */
  slice?: number;
}

export const DailyKlineChart: React.FC<DailyKlineChartProps> = ({
  index,
  start,
  end,
  source = "cs",
  height = 400,
  width = "100%",
  slice = 0,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<ECharts | null>(null);
  const [data, setData] = useState<DailyKline[]>([]);
  const [loading, setLoading] = useState(true);

  // 请求数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await fetchStockKline({ index, start, end, source });
        setData(result);
      } catch (error) {
        console.error("Failed to fetch stock data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [index, start, end, source, slice]);

  useEffect(() => {
    if (!chartRef.current || loading || data.length === 0) return;
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
  }, [data, loading, slice]);

  useEffect(() => {
    return () => {
      chartInstance.current && chartInstance.current.dispose();
      chartInstance.current = null;
    };
  }, []);

  if (loading) {
    return <div style={{ width, height }}>加载中...</div>;
  }

  return <div ref={chartRef} style={{ width, height }} />;
};
