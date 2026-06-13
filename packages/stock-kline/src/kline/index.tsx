import "./styles/index.less";
import "@arco-design/web-react/es/style/index.less";
import "./styles/index.less";

import { Button, Radio } from "@arco-design/web-react";
import type { Chart as KlineChartType } from "klinecharts";
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
    chart.createOverlay({
      name: "horizontalStraightLine",
      paneId: PANEL_ID,
      needDefaultPointFigure: true,
      mode: "weak_magnet",
      modeSensitivity: 1,
    });
  };

  const onDrawRegionSegmentLine = () => {
    const chart = chartRef.current!;
    chart.createOverlay({ name: "rangeLine" });
  };

  const onDrawStraightLine = () => {
    const chart = chartRef.current!;
    chart.createOverlay({
      name: "straightLine",
      mode: "weak_magnet",
      modeSensitivity: 1,
      needDefaultXAxisFigure: false,
    });
  };

  const onDrawPriceChannelLine = () => {
    const chart = chartRef.current!;
    chart.createOverlay({
      name: "priceChannelLine",
      mode: "weak_magnet",
      modeSensitivity: 1,
      needDefaultXAxisFigure: false,
    });
  };

  return (
    <div className="container">
      <Chart code={radioValue} onRef={chartRef} />
      <div className="chart-menus">
        <div className="radio-group">
          <Radio.Group value={radioValue} onChange={setRadioValue}>
            <Radio value="CSIH30269">红利低波 50</Radio>
            <Radio value="SH563020">易方达 50</Radio>
            <Radio value="SH512890">华泰柏瑞 50</Radio>
            <Radio value="CSI930955">红利低波 100</Radio>
            <Radio value="SZ159307">博时 100</Radio>
            <Radio value="SZ159549">天弘 100</Radio>
            <Radio value="SZ399986">中证银行</Radio>
            <Radio value=".INX">标普 500</Radio>
          </Radio.Group>
          <Radio.Group value={radioValue} onChange={setRadioValue}>
            <Radio value="SH000001">上证指数</Radio>
            <Radio value="SH000300">沪深 300</Radio>
            <Radio value="SZ399006">创业板指</Radio>
            <Radio value="SH000688">科创 50</Radio>
            <Radio value="CSIH30184">半导体</Radio>
            <Radio value="SH000922">中证红利</Radio>
            <Radio value="SH515450">标普红利低波</Radio>
            <Radio value="SZ980092">自由现金流</Radio>
          </Radio.Group>
        </div>
        <div className="button-group">
          <Button size="small" type="primary" onClick={onDrawHorizontalStraightLine}>
            水平线
          </Button>
          <Button size="small" type="primary" onClick={onDrawRegionSegmentLine}>
            区间线
          </Button>
          <Button size="small" type="primary" onClick={onDrawStraightLine}>
            双射线
          </Button>
          <Button size="small" type="primary" onClick={onDrawPriceChannelLine}>
            通道线
          </Button>
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
