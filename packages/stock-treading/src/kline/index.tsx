import "./styles/index.less";
import "@arco-design/web-react/es/style/index.less";
import "./styles/index.less";

import { Button, Radio } from "@arco-design/web-react";
import type { Chart as KlineChartType, Point } from "klinecharts";
import { useRef, useState } from "react";
import ReactDOM from "react-dom";

import { Chart } from "./modules/chart";
import { PANEL_ID } from "./modules/chart/config";

const App = () => {
  const [radioValue, setRadioValue] = useState("SH512890");
  const chartRef = useRef<KlineChartType>(null);

  const onDrawHorizontalStraightLine = () => {
    const chart = chartRef.current!;
    // https://klinecharts.com/guide/overlay
    // https://klinecharts.com/api/instance/createOverlay
    // https://klinecharts.com/api/instance/subscribeAction
    // https://klinecharts.com/api/instance/convertFromPixel
    let coordinate: Point | null = null;
    const onCrosshairChange = (params: unknown) => {
      const payload = params as { x: number; y: number; paneId: string };
      const value = chart.convertFromPixel([{ x: payload.x, y: payload.y }], {
        paneId: PANEL_ID,
        absolute: false,
      }) as Point[];
      coordinate = value[0] || null;
    };
    const onChartClick = () => {
      if (!coordinate) return void 0;
      chart.createOverlay({
        name: "horizontalStraightLine",
        paneId: PANEL_ID,
        needDefaultPointFigure: true,
        points: [{ timestamp: coordinate.timestamp, value: coordinate.value }],
      });
      container!.removeEventListener("click", onChartClick);
      chart.unsubscribeAction("onCrosshairChange", onCrosshairChange);
    };
    const container = chart.getDom();
    container!.addEventListener("click", onChartClick);
    chart.subscribeAction("onCrosshairChange", onCrosshairChange);
  };

  return (
    <div className="container">
      <div className="radio-group">
        <Radio.Group value={radioValue} onChange={setRadioValue}>
          <Radio value="CSIH30269">红利低波 50</Radio>
          <Radio value="SH512890">华泰柏瑞 50</Radio>
          <Radio value="SH563020">易方达 50</Radio>
          <Radio value="CSI930955">红利低波 100</Radio>
          <Radio value="SZ159549">天弘 100</Radio>
          <Radio value="SZ159307">博时 100</Radio>
        </Radio.Group>
      </div>
      <Chart code={radioValue} onRef={chartRef} />
      <div className="button-group">
        <Button type="primary" onClick={onDrawHorizontalStraightLine}>
          参考线
        </Button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
