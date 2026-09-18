import "./index.less";

import type { FC } from "react";
import { useEffect, useState } from "react";

import type { BarometerData, RatePriceData } from "./types";

export const Bounds: FC = () => {
  const [bp, setBp] = useState<BarometerData | null>(null);
  const [data, setData] = useState<RatePriceData | null>(null);

  useEffect(() => {
    fetch("https://m.nffund.com/operation_lnk/barometerInfo/queryBarometerRateData", {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      referrer: "https://m.nffund.com/cache/bondbarometer/index.html",
      body: '{"loading":2,"function":"queryBarometerRateData","bond_channel":"2"}',
      method: "POST",
    })
      .then(res => res.json())
      .then(json => setBp(json.data));
    fetch("https://m.nffund.com/operation_lnk/barometerInfo/queryBaoDanDataInfo", {
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      referrer: "https://m.nffund.com/cache/bondbarometer/index.html",
      body: '{"function":"queryBaoDanDataInfo","bond_channel":"2"}',
      method: "POST",
    })
      .then(res => res.json())
      .then(json => setData(json.data));
  }, []);

  if (!data || !bp) {
    return <div>Loading...</div>;
  }

  const calcBgColor = (bp: string) => {
    const n = Number(bp);
    if (!n) return "rgba(var(--gray-6), 0.3)";
    if (n < 0) return `rgba(var(--red-5), 0.3)`;
    return `rgba(var(--green-5), 0.3)`;
  };

  const calcFontColor = (bp: string) => {
    const n = Number(bp);
    if (!n) return "rgba(var(--gray-8), 0.9)";
    if (n < 0) return `rgba(var(--red-7), 0.8)`;
    return `rgba(var(--green-8), 0.8)`;
  };

  const calcProfitColor = (bp: string) => {
    const n = Number(bp);
    if (!n) return "rgba(var(--gray-8), 0.9)";
    if (n > 0) return `rgba(var(--red-7), 0.8)`;
    return `rgba(var(--green-8), 0.8)`;
  };

  return (
    <div>
      <div className="mb-10 bold">
        <span className="mr-10">债市交易概览</span>
        <span className="font-size-12">更新时间: {data.trade_date + " " + data.deadline_time}</span>
      </div>
      {bp.barometerRateItemList.map((it, i) => (
        <div key={i} className="flex align-center text-center">
          <div className="flex align-center bounds-card justify-center">{it.sub_type}</div>
          {it.bpDataList.map((bp, i) => (
            <div
              style={{ backgroundColor: calcBgColor(bp.bp || "0") }}
              className="flex align-center justify-center direction-column bounds-card font-size-12"
              key={i}
            >
              <div className="text-center">{bp.age_limit}</div>
              <div className="text-center" style={{ color: calcFontColor(bp.bp || "0") }}>
                {bp.bp || 0}bp
              </div>
            </div>
          ))}
        </div>
      ))}
      <div className="mt-20">
        <div className="mb-10 bold">债市收益预测</div>
        <table className="bounds-table">
          <tr className="text-center">
            <td colSpan={3}>利率债</td>
            <td colSpan={2}>信用债</td>
          </tr>
          <tr className="text-center">
            <td>短期债</td>
            <td>中期债</td>
            <td>长期债</td>
            <td>短期债</td>
            <td>中长债</td>
          </tr>
          <tr className="text-center">
            <td style={{ color: calcProfitColor(data.llz_short_price) }}>{data.llz_short_price}</td>
            <td style={{ color: calcProfitColor(data.llz_price) }}>{data.llz_price}</td>
            <td style={{ color: calcProfitColor(data.llz_long_price) }}>{data.llz_long_price}</td>
            <td style={{ color: calcProfitColor(data.yxz_short_price) }}>{data.yxz_short_price}</td>
            <td style={{ color: calcProfitColor(data.yxz_long_price) }}>{data.yxz_long_price}</td>
          </tr>
        </table>
      </div>
    </div>
  );
};
