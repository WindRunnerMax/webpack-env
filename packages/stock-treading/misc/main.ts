import { DateTime } from "@block-kit/utils";
import type { F } from "@block-kit/utils/dist/es/types";

import { fetchKLine } from "./fetch";

const BASE = "CSIH30269";
const ETF = "SH512890";
const options: F.Parameters<typeof fetchKLine>["3"] = {};

const main = async () => {
  const start = "2025-01-01";
  const end = new DateTime().format();
  const base = await fetchKLine(BASE, start, end, options);
  const etf = await fetchKLine(ETF, start, end, options);
  /** 现金 */
  let crash = 0;
  /** 收益 */
  let profit = 0;
  for (let i = 0; i < base.length; ++i) {
    const b = base[i];
    const e = etf[i];
    if (b.date !== e.date) continue;
    const balance = crash + profit;
    console.log("=========", b.date, "=========");
    const baseMaOffset = (b.close - b.ma) / b.ma;
    const etfMaOffset = (e.close - e.ma) / e.ma;
    console.log("指数 MA 偏移:", formatP(baseMaOffset));
    console.log("ETF MA 偏移:", formatP(etfMaOffset));
    const balanceChange = balance * e.change;
    console.log("当日涨幅", balanceChange.toFixed(2), formatP(e.change));
    profit = profit + balanceChange;

    // --------- strategy ---------
    // 仅跌时加仓, 设置为 false 则任何时机都加仓
    const isTodayIncr = e.change > 0;
    if (etfMaOffset < 0 && !isTodayIncr) {
      const ratio = -etfMaOffset * 1000;
      const radix = 1000;
      const added = 10000 + Math.floor(ratio * radix);
      console.log("> ETF 小于均线, 大幅加仓", added);
      crash = crash + added;
    } else if (baseMaOffset < 0 && !isTodayIncr) {
      const ratio = -baseMaOffset * 1000;
      const radix = 100;
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

const formatP = (num: number) => (num * 100).toFixed(4) + "%";

main();
