import "./styles/index.less";
import "@arco-design/web-react/es/style/index.less";

import { Fragment, useState } from "react";
import ReactDOM from "react-dom";

import { BasicChart } from "./component/charts/basic-chart";
import { FundChart } from "./component/charts/fund-chart";
import { Console } from "./component/console";

const App = () => {
  const [activeKey, setActiveKey] = useState(0);
  const slice = 100;

  return (
    <div className="body">
      <div className="candlestick">
        {activeKey === 0 && (
          <Fragment>
            <BasicChart
              title="H30269 红利低波指数"
              code="CSIH30269"
              slice={slice}
              source="snow-stock"
            ></BasicChart>
            <BasicChart title="H20269 红利低波全收益指数" code="H20269" slice={slice}></BasicChart>
            <BasicChart
              title="H563020 易方达红利低波ETF(前复权)"
              code="H563020"
              slice={slice}
              source="snow-stock"
            ></BasicChart>
            <BasicChart
              title="H512890 华泰柏瑞红利低波ETF(前复权)"
              code="H512890"
              slice={slice}
              source="snow-stock"
            ></BasicChart>
          </Fragment>
        )}

        {activeKey === 1 && (
          <Fragment>
            <BasicChart
              title="H930955 红利低波100指数"
              code="CSI930955"
              slice={slice}
              source="snow-stock"
              ma={200}
            ></BasicChart>
            <BasicChart
              title="H20955 红利低波100全收益指数"
              code="H20955"
              slice={slice}
              ma={200}
            ></BasicChart>
            <BasicChart
              title="Z159307 博时红利低波ETF(前复权)"
              code="Z159307"
              slice={slice}
              source="snow-stock"
              ma={200}
            ></BasicChart>
          </Fragment>
        )}

        {activeKey === 2 && (
          <Fragment>
            <FundChart
              title="020602 易方达红利低波联接基金"
              code="020602"
              slice={slice}
            ></FundChart>
            <FundChart title="021550 博时红利低波联接基金" code="021550" slice={slice}></FundChart>
            <FundChart
              title="007466 华泰柏瑞红利低波联接基金"
              code="007466"
              slice={slice}
            ></FundChart>
          </Fragment>
        )}
      </div>

      <Console radio={activeKey} onChange={setActiveKey} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
