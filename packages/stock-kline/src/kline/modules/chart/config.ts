import type { O } from "@block-kit/utils/dist/es/types";
import type {
  Chart,
  IndicatorTooltipData,
  KLineData,
  NeighborData,
  Nullable,
  TooltipLegend,
} from "klinecharts";

import { formatNumber } from "../../utils/format";

export const PANEL_ID = "candle_pane";
export const RED = "#F53F3F";
export const GREEN = "#00B42A";
export const GRAY = "#888888";

export const setChartConfig = (chart: Chart) => {
  // https://klinecharts.com/guide/styles
  chart.setStyles({
    candle: {
      tooltip: {
        showType: "standard",
        title: {
          show: false,
          color: "#333",
          template: "{ticker} · {close}",
        },
        legend: {
          color: "#333",
          template: (params: NeighborData<Nullable<KLineData>>): TooltipLegend[] => {
            const { current, prev } = params;
            const close = current?.close || 0;
            const prevClose = prev?.close || 0;
            const move = prevClose ? ((close - prevClose) / prevClose) * 100 : NaN;
            const moveColor = move < 0 ? GREEN : RED;
            return [
              { title: "time", value: "{time}" },
              { title: "volume", value: "{volume}" },
              { title: "low", value: "{low}" },
              { title: "high", value: "{high}" },
              { title: "open", value: "{open}" },
              {
                title: { text: "Close: ", color: moveColor },
                value: { text: `{close}[${formatNumber(move)}%]`, color: moveColor },
              },
            ];
          },
        },
      },
      bar: {
        upColor: RED,
        downColor: GREEN,
        noChangeColor: GRAY,
        upBorderColor: RED,
        downBorderColor: GREEN,
        noChangeBorderColor: GRAY,
        upWickColor: RED,
        downWickColor: GREEN,
        noChangeWickColor: GRAY,
      },
      priceMark: {
        last: {
          upColor: RED,
          downColor: GREEN,
          noChangeColor: GRAY,
        },
      },
    },
    indicator: {
      tooltip: {
        title: {
          color: "#333",
        },
      },
    },
  });

  // https://klinecharts.com/api/instance/createIndicator
  const styles = chart.getStyles();
  const lineStyles = styles.indicator.lines;
  chart.createIndicator(
    {
      name: "MA",
      calcParams: [200, 250, 300],
      createTooltipDataSource: params => {
        const { indicator, crosshair } = params;
        const p = indicator.precision;
        const result = indicator.result;
        const kLineData = crosshair.kLineData!;
        const data = result[crosshair.dataIndex!] as O.Map<number>;
        return {
          legends: indicator.calcParams.map((value, index) => {
            const lineColor = lineStyles[index].color;
            const title = `MA${value}: `;
            const ma = data["ma" + (index + 1)];
            if (!ma) return { title, value: "n/a" };
            const move = ((kLineData.close - ma) / ma) * 100;
            return {
              title: { color: lineColor, text: title },
              value: { color: lineColor, text: ma.toFixed(p) + `[${formatNumber(move)}%]` },
            };
          }),
        } as unknown as IndicatorTooltipData;
      },
    },
    true,
    { id: PANEL_ID }
  );
};
