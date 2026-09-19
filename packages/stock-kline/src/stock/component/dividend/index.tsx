import "./index.less";

import { useMemoFn } from "@block-kit/utils/dist/es/hooks";
import type { EChartsType } from "echarts/core";
import { init } from "echarts/core";
import type { FC } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { DividendChartItem } from "./config";
import { alignDividendData, getDividendChartOptions } from "./config";
import { fetch10YearTreasuryBond, fetch930955Dividend, fetchH30269Dividend } from "./model";

interface DividendChartProps {
  height?: number;
  data: DividendChartItem[];
  title: string;
}

function buildInfoBar(item: DividendChartItem): React.ReactNode {
  const pct = (v: number) => v.toFixed(1);
  const pct2 = (v: number) => v.toFixed(2);
  const diffSign = item.diff >= 0 ? "+" : "";
  const diffColor = item.diff >= 0 ? "#F53F3F" : "#00B42A";
  return (
    <>
      <span>
        {item.date} 股息率: {pct2(item.dividendYield)}%
        <span className="dividend-info-dim"> 分位: {pct(item.dividendPercentile)}%</span>
      </span>
      <span className="dividend-info-sep">|</span>
      <span>
        国债: {pct2(item.treasuryYield)}%
        <span className="dividend-info-dim"> 分位: {pct(item.treasuryPercentile)}%</span>
      </span>
      <span className="dividend-info-sep">|</span>
      <span style={{ fontWeight: 600, color: diffColor }}>
        差值: {diffSign}
        {pct2(item.diff)}%
        <span className="dividend-info-dim"> 分位: {pct(item.diffPercentile)}%</span>
      </span>
    </>
  );
}

const DividendChart: FC<DividendChartProps> = ({ height = 200, data, title }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<EChartsType | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const displayItem: DividendChartItem | null = useMemo(() => {
    if (hoveredIndex !== null && data[hoveredIndex]) {
      return data[hoveredIndex];
    }
    if (data.length > 0) {
      return data[data.length - 1];
    }
    return null;
  }, [data, hoveredIndex]);

  const handleChartMouseMove = useMemoFn((...args: unknown[]) => {
    const params = args[0] as Record<string, unknown> | undefined;
    const dataIndex = params?.dataIndex as number | undefined;
    if (dataIndex !== undefined && dataIndex >= 0 && data[dataIndex]) {
      setHoveredIndex(dataIndex);
    }
  });

  const handleChartMouseOut = useMemoFn(() => {
    setHoveredIndex(null);
  });

  useEffect(() => {
    if (!chartInstance.current && chartRef.current) {
      chartInstance.current = init(chartRef.current);
    }
    const chart = chartInstance.current;
    if (!chart) return;
    chart.on("updateAxisPointer", handleChartMouseMove);
    chart.getZr().on("globalout", handleChartMouseOut);
    chart.on("click", (params: unknown) => {
      console.log("DividendChart click:", params);
    });
    const handleResize = () => chart.resize();
    window.addEventListener("resize", handleResize);
    return () => {
      chart.off("updateAxisPointer", handleChartMouseMove);
      chart.getZr().off("globalout", handleChartMouseOut);
      window.removeEventListener("resize", handleResize);
    };
  }, [handleChartMouseMove, handleChartMouseOut]);

  useEffect(() => {
    if (!chartInstance.current || data.length <= 0) return;
    const option = getDividendChartOptions(data, title);
    chartInstance.current.setOption(option);
  }, [data, title]);

  useEffect(() => {
    return () => {
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  return (
    <div className="dividend-chart-section">
      <div className="dividend-chart-header">
        <span className="dividend-chart-title">{title}</span>
        {displayItem && <div className="dividend-chart-info">{buildInfoBar(displayItem)}</div>}
      </div>
      <div className="relative" style={{ height }}>
        <div className="chart-canvas" ref={chartRef} style={{ width: "100%", height }} />
        {data.length <= 0 && (
          <div className="absolute ml-10" style={{ top: 0, left: 0 }}>
            Loading...
          </div>
        )}
      </div>
    </div>
  );
};

export const Dividend: FC = () => {
  const [h30269Data, setH30269Data] = useState<DividendChartItem[]>([]);
  const [csi930955Data, setCsi930955Data] = useState<DividendChartItem[]>([]);

  const fetchData = useCallback(async () => {
    const [treasury, h30269, csi930955] = await Promise.all([
      fetch10YearTreasuryBond(),
      fetchH30269Dividend(),
      fetch930955Dividend(),
    ]);
    const h30269Aligned = alignDividendData(h30269, treasury);
    const csi930955Aligned = alignDividendData(csi930955, treasury);
    setH30269Data(h30269Aligned);
    setCsi930955Data(csi930955Aligned);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="dividend-container">
      <DividendChart
        height={300}
        data={h30269Data}
        title="H30269 红利低波股息率 - 十年期国债收益率"
      />
      <DividendChart
        height={300}
        data={csi930955Data}
        title="930955 红利低波100股息率 - 十年期国债收益率"
      />
    </div>
  );
};
