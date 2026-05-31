import "@arco-design/web-react/es/style/index.less";

import { debounce } from "@block-kit/utils";
import type { Chart as KlineChartType } from "klinecharts";
import { dispose, init } from "klinecharts";
import type { FC, MutableRefObject } from "react";
import { useCallback, useMemo } from "react";
import { useEffect, useRef } from "react";

import { setChartConfig } from "./config";
import { getStockLoader } from "./loader";

export const Chart: FC<{
  code: string;
  onRef: MutableRefObject<KlineChartType | null>;
}> = props => {
  const ref = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<KlineChartType | null>(null);

  const onResize = useCallback(() => chartInstance.current?.resize(), []);
  const debounceResize = useMemo(() => debounce(onResize, 100), [onResize]);

  useEffect(() => {
    // https://github.com/klinecharts/KLineChart/blob/3ff9334/docs/%40views/api/samples
    const chart = init(ref.current!)!;
    props.onRef.current = chart;
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
  }, [debounceResize, props.onRef, props.code]);

  return <div ref={ref} style={{ width: "100%", height: 600 }} />;
};
