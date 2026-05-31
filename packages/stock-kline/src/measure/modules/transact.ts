import { isNil } from "@block-kit/utils";

import type { PresetFormTypes } from "../utils/constant";
import type { DailyKline } from "../utils/kline";
import { formatP, formatR } from "../utils/kline";
import { Ledger } from "./ledger";

export class Transact {
  public constructor(private dom: HTMLDivElement) {}

  public apply(base: DailyKline[], etf: DailyKline[], payload: PresetFormTypes) {
    this.dom.innerHTML = "";
    const ledger = new Ledger();
    for (let i = 0; i < base.length; ++i) {
      const b = base[i];
      const e = etf[i];
      if (b.date !== e.date || isNil(b.ma) || isNil(e.ma)) {
        console.error(JSON.stringify(b), "-", JSON.stringify(e));
        continue;
      }

      this.log("=========", b.date, "=========");

      const baseMaOffset = (b.close - b.ma) / b.ma;
      const etfMaOffset = (e.close - e.ma) / e.ma - payload.offset;
      this.log("指数 MA 偏移:", formatP(baseMaOffset));
      this.log("ETF MA 偏移:", formatP(etfMaOffset));

      const moveRate = e.change;
      const amountChange = ledger.execMoveRate(moveRate);
      this.log("当日涨幅", formatR(amountChange), formatP(moveRate));

      const isMatchAddSide = this.inspectAddSide(b.change, e.change, payload);
      const isMatchAddRange = this.inspectAddRange(e.change, payload);

      const isNeedAddition = isMatchAddSide && isMatchAddRange;
      if (baseMaOffset < 0 && etfMaOffset > 0 && isNeedAddition) {
        const l = payload.light;
        const basic = -baseMaOffset * 1000;
        const added = Math.floor(Math.min(l.min + basic * l.radix, l.max));
        this.log("> 指数小于均线, 小幅加仓", added);
        ledger.addInvest(b.date, added);
      }
      if (baseMaOffset < 0 && etfMaOffset < 0 && isNeedAddition) {
        const h = payload.heavy;
        const basic = -etfMaOffset * 1000;
        const added = Math.floor(Math.min(h.min + basic * h.radix, h.max));
        this.log("> ETF 小于均线, 大幅加仓", added);
        ledger.addInvest(b.date, added);
      }

      const text = [
        "投入总额:",
        ledger.invest,
        "收益总额:",
        ledger.profit.toFixed(2),
        "收益率:",
        ledger.formatReturnRate(),
      ].join(" ");
      this.log(text, "\n");
    }

    console.log(ledger.formatInvests());
  }

  private inspectAddSide = (bChange: number, eChange: number, payload: PresetFormTypes) => {
    const loc = payload.loc;
    const isTodayIncr = eChange > 0 && bChange > 0;
    const isTodayDesc = eChange < 0 && bChange < 0;
    let isNeedAddition = false;
    if (loc === "both") {
      isNeedAddition = true;
    } else if (loc === "left") {
      isNeedAddition = isTodayDesc;
    } else if (loc === "right") {
      isNeedAddition = isTodayIncr;
    }
    return isNeedAddition;
  };

  private inspectAddRange = (eChange: number, payload: PresetFormTypes) => {
    const threshold = payload.threshold;
    const isExceedsThreshold = eChange < 0 && -eChange > threshold;
    return isExceedsThreshold;
  };

  private log(...content: (string | number)[]) {
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
    this.dom.appendChild(fragment);
  }
}
