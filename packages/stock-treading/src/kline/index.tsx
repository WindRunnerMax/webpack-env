import "./styles/index.less";
import "@arco-design/web-react/es/style/index.less";
import "./styles/index.less";

import { Radio } from "@arco-design/web-react";
import { useState } from "react";
import ReactDOM from "react-dom";

import { Chart } from "./modules/chart";

const App = () => {
  const [radioValue, setRadioValue] = useState("SH512890");

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
      <Chart code={radioValue} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
