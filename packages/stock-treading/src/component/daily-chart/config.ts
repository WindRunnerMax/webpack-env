import type { P } from "@block-kit/utils/dist/es/types";
import type { EChartsOption } from "echarts";

import type { DailyKline } from "../../types/stock";

export const getDailyChartConfig = (source: DailyKline[], slice: number = 0) => {
  const data = slice > 0 ? source.slice(-slice) : source;
  // 准备数据
  const dates = data.map(item => item.date);
  const klineData = data.map(item => [item.open, item.close, item.low, item.high]);

  // 计算 250 日均线
  const MA = 250;
  let sum = 0;
  let maValues: (number | null)[] = [];
  for (let i = 0; i < source.length; i++) {
    sum = sum + source[i].close;
    if (i < MA - 1) {
      maValues.push(null);
      continue;
    }
    maValues.push(sum / MA);
    sum = sum - source[i - MA + 1].close;
  }
  maValues = slice > 0 ? maValues.slice(-slice) : maValues;

  const option: EChartsOption = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
      },
      formatter: (params: P.Any) => {
        if (!params || params.length === 0) return "";
        const dataIndex = params[0].dataIndex;
        const item = data[dataIndex];
        let maValue: number = 0;
        const ma250Param = params.find((p: P.Any) => p.seriesName === "MA250");
        if (ma250Param && ma250Param.value !== null) {
          maValue = ma250Param.value;
        }
        let maRatio: number = 0;
        if (ma250Param.value && ma250Param.value !== null) {
          maRatio = ((item.close - ma250Param.value) / ma250Param.value) * 100;
        }
        return (
          `<div style="padding: 1px;">` +
          `  <div style="font-weight: bold; ">${item.date}</div>` +
          `  <div>开盘价: ${item.open} 收盘价: ${item.close}</div>` +
          `  <div>最低价: ${item.low} 最高价: ${item.high.toFixed(2)}</div>` +
          `  <div>` +
          `    ${item.volume ? `成交量: ${item.volume.toFixed(2)}` : ""}` +
          `    250MA: ${maValue.toFixed(maValue > 10000 ? 2 : 4)}` +
          `  </div>` +
          `  <div style="display:flex; gap: 10px;">` +
          `    <div style="color: ${item.change >= 0 ? "#ef5350" : "#26a69a"}">` +
          `      涨跌幅: ${item.change >= 0 ? "+" : ""}${item.change.toFixed(2)}%` +
          `    </div>` +
          `    <div style="color: ${maRatio >= 0 ? "#ef5350" : "#26a69a"}">` +
          `      均线偏离: ${maRatio >= 0 ? "+" : ""}${maRatio.toFixed(2)}%` +
          `    </div>` +
          `  </div>` +
          `</div>`
        );
      },
    },
    grid: [{ left: "0", right: "0", top: "0", height: "100%" }],
    xAxis: [
      {
        type: "category",
        data: dates,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: { show: true },
        min: "dataMin",
        max: "dataMax",
      },
    ],
    yAxis: [
      {
        scale: true,
        splitLine: { show: true },
      },
    ],
    series: [
      {
        name: "K线",
        type: "candlestick",
        data: klineData,
        itemStyle: {
          color: "#ff0400",
          color0: "#26a69a",
          borderColor: "#ef5350",
          borderColor0: "#26a69a",
        },
      },
      {
        name: "MA250",
        type: "line",
        data: maValues,
        smooth: true,
        lineStyle: { width: 1, color: "#ff9800" },
        symbol: "none",
      },
    ],
  };
  return option;
};
