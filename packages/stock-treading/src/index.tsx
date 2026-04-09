import "./styles/index.less";
import "@arco-design/web-react/es/style/index.less";

import { Tabs } from "@arco-design/web-react";
import { DateTime } from "@block-kit/utils";
import ReactDOM from "react-dom";

import { BasicChart } from "./component/charts/basic-chart";
import { FundChart } from "./component/charts/fund-chart";

const TabPane = Tabs.TabPane;

const App = () => {
  const start = new DateTime().deferMonth(-24);
  const slice = 100;

  return (
    <div className="body">
      <Tabs tabPosition="right">
        <TabPane key="1" title="红利低波">
          <BasicChart
            title="H30269 红利低波指数"
            code="CSIH30269"
            start={start}
            slice={slice}
            source="snow-stock"
          />
          <BasicChart title="H20269 红利低波全收益指数" code="H20269" start={start} slice={slice} />
          <BasicChart
            title="H512890 华泰柏瑞红利低波ETF(前复权)"
            code="H512890"
            start={start}
            slice={slice}
            source="snow-stock"
          />
          <BasicChart
            title="H563020 易方达红利低波ETF(前复权)"
            code="H563020"
            start={start}
            slice={slice}
            source="snow-stock"
          />
          <FundChart
            title="007466 华泰柏瑞红利低波联接基金"
            code="007466"
            start={start}
            slice={slice}
          />
          <FundChart
            title="020602 易方达红利低波联接基金"
            code="020602"
            start={start}
            slice={slice}
          />
        </TabPane>
        <TabPane key="2" title="红利低波100">
          <BasicChart
            title="H930955 红利低波100指数"
            code="CSI930955"
            start={start}
            slice={slice}
            source="snow-stock"
          />
          <BasicChart
            title="H20955 红利低波100全收益指数"
            code="H20955"
            start={start}
            slice={slice}
          />
          <BasicChart
            title="Z159307 博时红利低波ETF(前复权)"
            code="Z159307"
            start={start}
            slice={slice}
            source="snow-stock"
          />
          <FundChart
            title="021550 博时红利低波联接基金"
            code="021550"
            start={start}
            slice={slice}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
