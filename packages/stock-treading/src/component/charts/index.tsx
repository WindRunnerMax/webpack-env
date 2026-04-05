import type { FC } from "react";

import type { DailyKlineChartProps } from "../daily-chart";
import { DailyKlineChart } from "../daily-chart";

export const ChartBox: FC<{
  title: string;
  chartProps: DailyKlineChartProps;
}> = props => {
  return (
    <div className="part">
      <div className="title">{props.title}</div>
      <div className="chart-container">
        <DailyKlineChart {...props.chartProps} />
      </div>
    </div>
  );
};
