import "@arco-design/web-react/es/style/index.less";

import { debounce } from "@block-kit/utils";
import type { Chart as KlineChartType } from "klinecharts";
import { dispose, init } from "klinecharts";
import type { FC } from "react";
import { useCallback, useMemo } from "react";
import { useEffect, useRef } from "react";

import { setChartConfig } from "./config";
import { getStockLoader } from "./loader";

export const Chart: FC<{ code: string }> = props => {
  const ref = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<KlineChartType | null>(null);

  const onResize = useCallback(() => chartInstance.current?.resize(), []);
  const debounceResize = useMemo(() => debounce(onResize, 100), [onResize]);

  useEffect(() => {
    const chart = init(ref.current!)!;
    chartInstance.current = chart;
    chart.setSymbol({ ticker: props.code, pricePrecision: 4 });
    chart.setPeriod({ span: 1, type: "day" });
    setChartConfig(chart);
    chart.setDataLoader(getStockLoader(props.code));

    window.addEventListener("resize", debounceResize);
    return () => {
      dispose(chart!);
      chartInstance.current = null;

      window.removeEventListener("resize", debounceResize);
    };
  }, [debounceResize, props.code]);

  return <div ref={ref} style={{ width: "100%", height: 600 }} />;
};
