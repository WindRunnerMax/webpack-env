import { isNil } from "@block-kit/utils";

import type { PresetFormTypes } from "./constant";
import type { DailyKline } from "./kline";

export const formatP = (num: number) => (num * 100).toFixed(4) + "%";

export const appendContent = (ref: HTMLDivElement, ...content: (string | number)[]) => {
  const string = content.join(" ") + "\n";
  const fragment = document.createDocumentFragment();
  const text = document.createTextNode(string);
  if (string.startsWith(">")) {
    const span = document.createElement("span");
    span.style.color = "#165DFF";
    span.appendChild(text);
    fragment.appendChild(span);
  } else {
    fragment.appendChild(text);
  }
  ref.appendChild(fragment);
};

export const writeContentByKline = (
  ref: HTMLDivElement,
  base: DailyKline[],
  etf: DailyKline[],
  payload: PresetFormTypes
) => {
  ref.innerHTML = "";
  /** 历史总投入 */
  let crash = 0;
  /** 收益 */
  let profit = 0;
  for (let i = 0; i < base.length; ++i) {
    const b = base[i];
    const e = etf[i];
    if (b.date !== e.date || isNil(b.ma) || isNil(e.ma)) {
      throw new Error(JSON.stringify(b) + "-" + JSON.stringify(e));
    }

    const balance = crash + profit;
    appendContent(ref, "=========", b.date, "=========");

    const baseMaOffset = (b.close - b.ma) / b.ma;
    const etfMaOffset = (e.close - e.ma) / e.ma - payload.offset;
    appendContent(ref, "指数 MA 偏移:", formatP(baseMaOffset));
    appendContent(ref, "ETF MA 偏移:", formatP(etfMaOffset));

    // change = (close - lastClose) / lastClose
    const balanceChange = balance * e.change;
    appendContent(ref, "当日涨幅", balanceChange.toFixed(2), formatP(e.change));
    profit = profit + balanceChange;

    const isTodayIncr = e.change > 0 && b.change > 0;
    const isTodayDesc = e.change < 0 && b.change < 0;
    let isNeedAddition = false;
    if (payload.loc === "both") {
      isNeedAddition = true;
    } else if (payload.loc === "left") {
      isNeedAddition = isTodayDesc;
    } else if (payload.loc === "right") {
      isNeedAddition = isTodayIncr;
    }
    if (baseMaOffset < 0 && etfMaOffset < 0 && isNeedAddition) {
      const h = payload.heavy;
      const ratio = -etfMaOffset * 1000;
      const radix = h.radix;
      const added = Math.min(h.min + Math.floor(ratio * radix), h.max);
      appendContent(ref, "> ETF 小于均线, 大幅加仓", added);
      crash = crash + added;
    }
    if (baseMaOffset < 0 && etfMaOffset > 0 && isNeedAddition) {
      const l = payload.light;
      const ratio = -baseMaOffset * 1000;
      const radix = l.radix;
      const added = Math.min(l.min + Math.floor(ratio * radix), l.max);
      appendContent(ref, "> 指数小于均线, 小幅加仓", added);
      crash = crash + added;
    }

    const text = [
      "投入总额:",
      crash,
      "收益总额:",
      profit.toFixed(2),
      "收益率:",
      formatP(crash ? profit / crash : 0),
    ].join(" ");
    appendContent(ref, text, "\n");
  }
};
