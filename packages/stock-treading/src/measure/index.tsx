import "./styles/index.less";
import "@arco-design/web-react/es/style/index.less";

import { Button, DatePicker, Form, InputNumber, Radio, Space } from "@arco-design/web-react";
import { useLayoutEffect, useRef } from "react";
import ReactDOM from "react-dom";

import type { PresetFormTypes } from "./utils/constant";
import { PRESET_50, PRESET_100 } from "./utils/constant";
import { alignKlineData, fetchMeasureKline } from "./utils/kline";
import { writeContentByKline } from "./utils/write";

const App = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [form] = Form.useForm();

  useLayoutEffect(() => {
    form.setFieldsValue(PRESET_50);
    ref.current && (ref.current.style.maxHeight = ref.current.clientHeight + "px");
  }, [form]);

  const submit = async () => {
    const p: PresetFormTypes = await form.validate();
    const base1 = await fetchMeasureKline(p.base, p.start, p.ma);
    const etf1 = await fetchMeasureKline(p.etf, p.start, p.ma);
    const [base, etf] = alignKlineData(p.start, base1, etf1);
    writeContentByKline(ref.current!, base, etf, p);
    ref.current && (ref.current.scrollTop = ref.current.scrollHeight);
  };

  return (
    <div className="container flex-row">
      <div className="content-area" ref={ref}></div>
      <Form
        form={form}
        style={{ width: 800 }}
        size="small"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item label="基线" field="base">
          <Radio.Group>
            <Radio value="CSIH30269">红利低波</Radio>
            <Radio value="CSI930955">红利低波100</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="ETF" field="etf">
          <Radio.Group>
            <Radio value="SH563020">易方达(50)</Radio>
            <Radio value="SH512890">华泰柏瑞(50)</Radio>
            <Radio value="SZ159307">博时(100)</Radio>
            <Radio value="SZ159307">天弘(100)</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="起始日" field="start">
          <DatePicker showTime={false} style={{ width: 200 }} />
        </Form.Item>
        <Form.Item label="均线 MA" field="ma">
          <Radio.Group>
            <Radio value={200}>200 MA</Radio>
            <Radio value={250}>250 MA</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="ETF 偏移" field="offset">
          <InputNumber />
        </Form.Item>
        <Form.Item label="微调持仓" className="secondary-form">
          <Form.Item label="最小值" field="light.min">
            <InputNumber />
          </Form.Item>
          <Form.Item label="倍率" field="light.radix">
            <InputNumber />
          </Form.Item>
          <Form.Item label="最大值" field="light.max">
            <InputNumber />
          </Form.Item>
        </Form.Item>
        <Form.Item label="增持仓位" className="secondary-form">
          <Form.Item label="最小值" field="heavy.min">
            <InputNumber />
          </Form.Item>
          <Form.Item label="倍率" field="heavy.radix">
            <InputNumber />
          </Form.Item>
          <Form.Item label="最大值" field="heavy.max">
            <InputNumber />
          </Form.Item>
        </Form.Item>
        <Form.Item label="交易位置" field="loc">
          <Radio.Group>
            <Radio value="left">左侧交易</Radio>
            <Radio value="right">右侧交易</Radio>
            <Radio value="both">两侧交易</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label={<></>} className="secondary-form">
          <Space size={20}>
            <Button type="primary" onClick={submit}>
              计算
            </Button>
            <Button onClick={() => form.setFieldsValue(PRESET_50)}>预设红利低波</Button>
            <Button onClick={() => form.setFieldsValue(PRESET_100)}>预设红利低波100</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
