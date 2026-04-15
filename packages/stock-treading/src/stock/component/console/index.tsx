import "./index.less";

import { Button, Radio } from "@arco-design/web-react";
import { IconCheck, IconMinus, IconRefresh } from "@arco-design/web-react/icon";
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
      <strong>常用操作</strong>
      <div className="operations">
        <Button
          size="mini"
          icon={enableAlarm ? <IconCheck /> : <IconMinus />}
          onClick={() => onAlarmEnableChange(!enableAlarm)}
        >
          14:45 通知提醒
        </Button>
        <Button size="mini" icon={<IconRefresh />} onClick={() => chrome.runtime.reload()}>
          重载浏览器扩展
        </Button>
      </div>
      <strong>相关链接</strong>
      <div className="links">
        <a href="https://funddb.cn/tool/fear" target="_blank" rel="noopener noreferrer">
          恐贪指数
        </a>
        <a
          href="https://funddb.cn/site/index?_q=红利低波"
          target="_blank"
          rel="noopener noreferrer"
        >
          指数估值(总)
        </a>
        <a
          href="https://danjuanfunds.com/dj-valuation-table-detail/CSIH30269"
          target="_blank"
          rel="noopener noreferrer"
        >
          指数估值(雪球)
        </a>
        <a href="https://github.com/WindRunnerMax/webpack-env/releases" target="_blank">
          GitHub Release
        </a>
      </div>
    </div>
  );
};
