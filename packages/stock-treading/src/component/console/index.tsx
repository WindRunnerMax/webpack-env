import "./index.less";

import { Checkbox, Radio } from "@arco-design/web-react";
import type { FC } from "react";
import { useLayoutEffect, useState } from "react";

import { getAlarmSetting, setAlarmSetting } from "./alarm";
const RadioGroup = Radio.Group;

export const Console: FC<{
  radio: number;
  onChange: (value: number) => void;
}> = props => {
  const [enableAlarm, setEnableAlarm] = useState(false);

  useLayoutEffect(() => {
    getAlarmSetting().then(v => setEnableAlarm(!!v));
  }, []);

  const onAlarmEnableChange = (checked: boolean) => {
    setEnableAlarm(checked);
    setAlarmSetting(checked);
  };

  return (
    <div className="console-container">
      <strong>红利低波类型</strong>
      <RadioGroup direction="vertical" onChange={props.onChange} defaultValue={props.radio}>
        <Radio value={0}>红利低波</Radio>
        <Radio value={1}>红利低波100</Radio>
        <Radio value={2}>联结基金</Radio>
      </RadioGroup>
      <strong>定时提醒</strong>
      <div style={{ lineHeight: "32px" }}>
        <Checkbox checked={enableAlarm} onChange={onAlarmEnableChange}>
          14:45 通知提醒
        </Checkbox>
      </div>
    </div>
  );
};
