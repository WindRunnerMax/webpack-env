import "./styles/index.less";
import "@arco-design/web-react/es/style/index.less";

import { Button, DatePicker, Form, InputNumber, Link, Radio, Space } from "@arco-design/web-react";
import { useLayoutEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import type { PresetFormTypes } from "./utils/constant";
import {
  END_DATE,
  PRESET_50_1,
  PRESET_50_2,
  PRESET_100_1,
  PRESET_100_2,
  START_DATE,
} from "./utils/constant";
import { alignKlineData, fetchMeasureKline } from "./utils/kline";
import { transactLedgerByKline } from "./utils/transact";

const App = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useLayoutEffect(() => {
    form.setFieldsValue(PRESET_50_1);
    ref.current && (ref.current.style.maxHeight = ref.current.clientHeight + "px");
  }, [form]);

  const submit = async () => {
    setLoading(true);
    const p: PresetFormTypes = await form.validate();
    const base1 = await fetchMeasureKline(p.base, p);
    const etf1 = await fetchMeasureKline(p.etf, p);
    const [base, etf] = alignKlineData(p.start, base1, etf1);
    transactLedgerByKline(ref.current!, base, etf, p);
    ref.current && (ref.current.scrollTop = ref.current.scrollHeight);
    setLoading(false);
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
        <Form.Item label="日期" className="data-picker-row">
          <Form.Item field="start" initialValue={START_DATE} noStyle>
            <DatePicker showTime={false} style={{ width: 150 }} />
          </Form.Item>
          <span className="delimiter-span"></span>
          <Form.Item field="end" initialValue={END_DATE} noStyle>
            <DatePicker showTime={false} style={{ width: 150 }} />
          </Form.Item>
        </Form.Item>
        <Form.Item label="基线" field="base">
          <Radio.Group>
            <Radio value="CSIH30269">红利低波</Radio>
            <Radio value="CSI930955">红利低波 100</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="ETF" field="etf">
          <Radio.Group>
            <Radio value="SH563020">易方达 50</Radio>
            <Radio value="SH512890">华泰柏瑞 50</Radio>
            <Radio value="SZ159307">博时 100</Radio>
            <Radio value="SZ159549">天弘 100</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label="均线 MA" field="ma">
          <Radio.Group>
            <Radio value={200}>200 MA</Radio>
            <Radio value={250}>250 MA</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label="ETF 偏移" field="offset">
          <InputNumber step={0.001} />
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
        <Form.Item label="数据预设">
          <Space size={10}>
            <Link onClick={() => form.setFieldsValue(PRESET_50_1)}>易方达 50</Link>
            <Link onClick={() => form.setFieldsValue(PRESET_50_2)}>华泰柏瑞 50</Link>
            <Link onClick={() => form.setFieldsValue(PRESET_100_1)}>博时 100</Link>
            <Link onClick={() => form.setFieldsValue(PRESET_100_2)}>天弘 100</Link>
          </Space>
        </Form.Item>
        <Form.Item label={<></>} className="secondary-form">
          <Space size={10}>
            <Button type="primary" onClick={submit} loading={loading}>
              计算数据
            </Button>
            <Button onClick={() => (ref.current!.innerHTML = "")}>清理日志</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
