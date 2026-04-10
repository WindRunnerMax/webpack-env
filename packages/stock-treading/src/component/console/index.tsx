import "./index.less";

import { Radio } from "@arco-design/web-react";
import type { FC } from "react";
const RadioGroup = Radio.Group;

export const Console: FC<{
  radio: number;
  onChange: (value: number) => void;
}> = props => {
  return (
    <div className="console-container">
      <strong>红利低波类型</strong>
      <RadioGroup direction="vertical" onChange={props.onChange} defaultValue={props.radio}>
        <Radio value={0}>红利低波</Radio>
        <Radio value={1}>红利低波100</Radio>
        <Radio value={2}>联结基金</Radio>
      </RadioGroup>
    </div>
  );
};
