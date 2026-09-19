import type { EChartsOption } from "echarts";
import { LineChart } from "echarts/charts";
import { DataZoomComponent, GridComponent, TooltipComponent } from "echarts/components";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";

use([LineChart, CanvasRenderer, GridComponent, DataZoomComponent, TooltipComponent]);

export interface DividendChartItem {
  date: string;
  dividendYield: number;
  dividendPercentile: number;
  treasuryYield: number;
  treasuryPercentile: number;
  diff: number;
  diffPercentile: number;
}

function calcPercentile(values: number[], current: number): number {
  let count = 0;
  for (const v of values) {
    if (v <= current) count++;
  }
  return (count / values.length) * 100;
}

export const getDividendChartOptions = (
  data: DividendChartItem[],
  seriesName: string
): EChartsOption => {
  const dates = data.map(item => item.date);
  const diffValues = data.map(item => item.diff);
  const avgDiff = diffValues.reduce((a, b) => a + b, 0) / diffValues.length;

  const option: EChartsOption = {
    tooltip: {
      trigger: "axis",
      showContent: false,
      axisPointer: { type: "cross" },
    },
    grid: [
      {
        left: "0",
        right: "0",
        top: "0",
        bottom: "55",
        height: "auto",
      },
    ],
    dataZoom: [
      {
        type: "slider",
        xAxisIndex: 0,
        bottom: 5,
        height: 30,
        start: Math.max(0, 100 - (200 / data.length) * 100),
        end: 100,
      },
    ],
    xAxis: [
      {
        type: "category",
        data: dates,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: true },
        axisLabel: {
          show: true,
        },
      },
    ],
    yAxis: [
      {
        scale: true,
        splitLine: { show: true },
        axisLabel: {
          formatter: (value: number) => `${value.toFixed(1)}%`,
        },
      },
    ],
    series: [
      {
        name: seriesName,
        type: "line",
        data: diffValues,
        smooth: true,
        lineStyle: { width: 2, color: "#4080FF" },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(64, 128, 255, 0.3)" },
              { offset: 1, color: "rgba(64, 128, 255, 0.05)" },
            ],
          },
        },
        symbol: "none",
      },
      {
        name: "零轴",
        type: "line",
        data: dates.map(() => 0),
        lineStyle: { type: "dashed", color: "#86909C", width: 1 },
        symbol: "none",
        silent: true,
        legendHoverLink: false,
      },
      {
        name: "均值",
        type: "line",
        data: dates.map(() => avgDiff),
        lineStyle: { type: "dashed", color: "#FF7D00", width: 1 },
        symbol: "none",
        silent: true,
        legendHoverLink: false,
      },
    ],
  };
  return option;
};

export interface RawDividendSeries {
  name: string;
  data: [timestamp: number, percentage: number][];
}

export function alignDividendData(
  dividendSeries: RawDividendSeries,
  treasurySeries: RawDividendSeries
): DividendChartItem[] {
  const treasuryMap = new Map<string, number>();
  for (const [ts, pct] of treasurySeries.data) {
    const date = formatTimestamp(ts);
    treasuryMap.set(date, pct);
  }

  const rawItems: { date: string; dividendYield: number; treasuryYield: number }[] = [];
  for (const [ts, pct] of dividendSeries.data) {
    const date = formatTimestamp(ts);
    const treasuryYield = treasuryMap.get(date);
    if (treasuryYield !== undefined) {
      rawItems.push({ date, dividendYield: pct, treasuryYield });
    }
  }

  rawItems.sort((a, b) => a.date.localeCompare(b.date));

  const allDividendYields = rawItems.map(item => item.dividendYield);
  const allTreasuryYields = rawItems.map(item => item.treasuryYield);
  const allDiffs = rawItems.map(item => item.dividendYield - item.treasuryYield);

  const result: DividendChartItem[] = [];
  for (const item of rawItems) {
    const diff = item.dividendYield - item.treasuryYield;
    result.push({
      date: item.date,
      dividendYield: item.dividendYield,
      dividendPercentile: calcPercentile(allDividendYields, item.dividendYield),
      treasuryYield: item.treasuryYield,
      treasuryPercentile: calcPercentile(allTreasuryYields, item.treasuryYield),
      diff,
      diffPercentile: calcPercentile(allDiffs, diff),
    });
  }

  return result;
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
