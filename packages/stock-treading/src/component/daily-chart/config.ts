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
        let ma250Value = "";
        const ma250Param = params.find((p: P.Any) => p.seriesName === "MA250");
        if (ma250Param && ma250Param.value != null) {
          ma250Value = `<div>250日均线: ${ma250Param.value.toFixed(2)}</div>`;
        }
        return `
            <div style="padding: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${item.date}</div>
              <div>开盘价: ${item.open.toFixed(2)}</div>
              <div>收盘价: ${item.close.toFixed(2)}</div>
              <div>最高价: ${item.high.toFixed(2)}</div>
              <div>最低价: ${item.low.toFixed(2)}</div>
              <div style="color: ${item.change >= 0 ? "#ef5350" : "#26a69a"}">
                涨跌幅: ${item.change >= 0 ? "+" : ""}${item.change.toFixed(2)}%
              </div>
              ${ma250Value}
            </div>
          `;
      },
    },
    grid: [
      {
        left: "0",
        right: "0",
        top: "0",
        height: "100%",
      },
    ],
    xAxis: [
      {
        type: "category",
        data: dates,
        boundaryGap: false,
        axisLine: { onZero: false },
        splitLine: {
          show: true,
        },
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
        lineStyle: {
          width: 1,
          color: "#ff9800",
        },
        symbol: "none",
      },
    ],
  };
  return option;
};
