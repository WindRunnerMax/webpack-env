import "@arco-design/web-react/es/style/index.less";

import { dispose, init } from "klinecharts";
import { useEffect, useRef } from "react";

import { getStockLoader } from "./loader";

export const Chart = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chart = init(ref.current!)!;
    chart.setSymbol({ ticker: "SH512890" });
    chart.setPeriod({ span: 1, type: "day" });
    chart.createIndicator("MA", true, { id: "candle_pane" });
    chart.setDataLoader(getStockLoader("SH512890"));
    return () => {
      dispose(chart);
    };
  }, []);

  return <div ref={ref} style={{ width: 1000, height: 600 }} />;
};
