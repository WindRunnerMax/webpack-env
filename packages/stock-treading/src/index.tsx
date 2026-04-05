import "./styles/index.less";
import "@arco-design/web-react/es/style/index.less";

import { DateTime } from "@block-kit/utils";
import ReactDOM from "react-dom";

import { ChartBox } from "./component/charts";

const App = () => {
  const start = "20240101";
  const end = new DateTime().format("yyyyMMdd");
  const slice = 100;
  const height = 200;

  return (
    <div className="body">
      <ChartBox
        title="H30269 红利低波"
        chartProps={{ index: "H30269", start, end, slice, height }}
      />
      <ChartBox
        title="H20269 红利低波全收益"
        chartProps={{ index: "H20269", start, end, slice, height }}
      />
      <ChartBox
        title="H512890 华泰柏瑞中证红利低波"
        chartProps={{ index: "sh512890", start, end, slice, height, source: "ten-stock" }}
      />
      <ChartBox
        title="H563020 易方达中证红利低"
        chartProps={{ index: "sh563020", start, end, slice, height, source: "ten-stock" }}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
