import type { O } from "@block-kit/utils/dist/es/types";
import type { Chart, IndicatorTooltipData, KLineData, NeighborData, Nullable } from "klinecharts";

import { formatNumber } from "../../utils/format";

export const setChartConfig = (chart: Chart) => {
  // https://klinecharts.com/api/instance/createIndicator
  chart.createIndicator(
    {
      name: "MA",
      calcParams: [200, 250],
      createTooltipDataSource: params => {
        const { indicator, crosshair } = params;
        const p = indicator.precision;
        const result = indicator.result;
        const kLineData = crosshair.kLineData!;
        const data = result[crosshair.dataIndex!] as O.Map<number>;
        return {
          legends: indicator.calcParams.map((value, index) => {
            const title = `MA${value}: `;
            const ma = data["ma" + (index + 1)];
            if (!ma) return { title, value: "n/a" };
            const move = ((kLineData.close - ma) / ma) * 100;
            return {
              title,
              value: ma.toFixed(p) + `[${formatNumber(move)}%]`,
            };
          }),
        } as unknown as IndicatorTooltipData;
      },
    },
    true,
    { id: "candle_pane" }
  );

  // https://klinecharts.com/guide/styles
  chart.setStyles({
    candle: {
      tooltip: {
        showType: "standard",
        title: {
          show: false,
        },
        legend: {
          template: (params: NeighborData<Nullable<KLineData>>) => {
            const { current, prev } = params;
            const close = current?.close || 0;
            const prevClose = prev?.close || 0;
            const move = prevClose ? ((close - prevClose) / prevClose) * 100 : NaN;
            return [
              { title: "time", value: "{time}" },
              { title: "volume", value: "{volume}" },
              { title: "low", value: "{low}" },
              { title: "high", value: "{high}" },
              { title: "open", value: "{open}" },
              { title: "Close: ", value: `{close}[${formatNumber(move)}%]` },
            ];
          },
        },
      },
      bar: {
        upColor: "#F53F3F",
        downColor: "#00B42A",
        noChangeColor: "#888888",
        upBorderColor: "#F53F3F",
        downBorderColor: "#00B42A",
        noChangeBorderColor: "#888888",
        upWickColor: "#F53F3F",
        downWickColor: "#00B42A",
        noChangeWickColor: "#888888",
      },
    },
  });
};
