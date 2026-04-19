import { DateTime } from "@block-kit/utils";
import type { F } from "@block-kit/utils/dist/es/types";

import { fetchKLine } from "./fetch";
import { alignKline, formatP } from "./utils";

const BASE = "CSI930955";
const ETF = "SZ159307";
const ETF_OFFSET = 0.006;
const options: F.Parameters<typeof fetchKLine>["3"] = {
  ma: 200,
};

const main = async () => {
  const start = "2025-01-01";
  const end = new DateTime().format();
  const base1 = await fetchKLine(BASE, start, end, options);
  const etf1 = await fetchKLine(ETF, start, end, options);
  const [base, etf] = alignKline(base1, etf1);
  /** 历史总投入 */
  let crash = 0;
  /** 收益 */
  let profit = 0;
  for (let i = 0; i < base.length; ++i) {
    const b = base[i];
    const e = etf[i];
    if (b.date !== e.date || !b.ma || !e.ma) {
      throw new Error(JSON.stringify(b) + "-" + JSON.stringify(e));
    }
    const balance = crash + profit;
    console.log("=========", b.date, "=========");
    const baseMaOffset = (b.close - b.ma) / b.ma;
    const etfMaOffset = (e.close - e.ma) / e.ma - ETF_OFFSET;
    console.log("指数 MA 偏移:", formatP(baseMaOffset));
    console.log("ETF MA 偏移:", formatP(etfMaOffset));
    // change = (close - lastClose) / lastClose
    const balanceChange = balance * e.change;
    console.log("当日涨幅", balanceChange.toFixed(2), formatP(e.change));
    profit = profit + balanceChange;

    // --------- strategy ---------
    // 仅跌时加仓, 设置为 false 则符合条件下涨跌都加仓
    const isTodayIncr = e.change > 0;
    if (etfMaOffset < 0 && !isTodayIncr) {
      const ratio = -etfMaOffset * 1000;
      const radix = 1000;
      const added = Math.min(10000 + Math.floor(ratio * radix), 20000);
      console.log("> ETF 小于均线, 大幅加仓", added);
      crash = crash + added;
    } else if (baseMaOffset < 0 && !isTodayIncr) {
      const ratio = -baseMaOffset * 1000;
      const radix = 100; /** 基准 */
      const added = Math.floor(ratio * radix);
      console.log("> 指数小于均线, 小幅加仓", added);
      crash = crash + added;
    }
    // --------- strategy ---------

    console.log(
      "投入总额:",
      crash,
      "收益总额:",
      profit.toFixed(2),
      "收益率:",
      formatP(profit / crash)
    );
    console.log("");
  }
};

main();
