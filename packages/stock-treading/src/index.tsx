import "./styles/index.less";
import "@arco-design/web-react/es/style/index.less";

import ReactDOM from "react-dom";

import { ChartBox } from "./component/charts";

const App = () => {
  const start = "20240101";
  const slice = 100;

  return (
    <div className="body">
      <ChartBox title="H30269 红利低波指数" chartProps={{ code: "H30269", start, slice }} />
      <ChartBox title="H20269 红利低波全收益指数" chartProps={{ code: "H20269", start, slice }} />
      <ChartBox
        title="H512890 华泰柏瑞中证红利低波"
        chartProps={{ code: "SH512890", start, slice, source: "snow-stock" }}
      />
      <ChartBox
        title="007466 华泰柏瑞中证红利低波联接"
        chartProps={{ code: "007466", start, slice, source: "ten-fund" }}
      />
      <ChartBox
        title="H563020 易方达中证红利低"
        chartProps={{ code: "SH563020", start, slice, source: "snow-stock" }}
      />
      <ChartBox
        title="020602 易方达中证红利低联接"
        chartProps={{ code: "020602", start, slice, source: "ten-fund" }}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
