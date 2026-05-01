import type { IInvest } from "../types/ledger";
import { formatP, formatR } from "../utils/kline";

export class Ledger {
  /** 历史投入记录 */
  public invests: IInvest[] = [];

  /** 投入总金额 */
  public get invest() {
    return this.invests.reduce((acc, cur) => acc + cur.invest, 0);
  }

  /** 收益总金额 */
  public get profit() {
    return this.invests.reduce((acc, cur) => acc + cur.profit, 0);
  }

  /**
   * 资金总金额
   * - 投入总金额 + 收益总金额
   */
  public get amount() {
    return this.invest + this.profit;
  }

  /**
   * 执行资金涨跌
   * - rate = (close - lastClose) / lastClose
   */
  public execMoveRate(rate: number) {
    const change = this.amount * rate;
    this.invests.forEach(item => {
      const amount = item.invest + item.profit;
      item.profit = item.profit + amount * rate;
    });
    return change;
  }

  /**
   * 增加投资记录
   */
  public addInvest(date: string, invest: number) {
    this.invests.push({ date, invest, profit: 0 });
  }

  /**
   * 格式化收益率
   */
  public formatReturnRate() {
    const invest = this.invest;
    const profit = this.profit;
    return formatP(invest ? profit / invest : 0);
  }

  /**
   * 格式化投资记录
   */
  public formatInvests() {
    return this.invests.map(item => ({
      ...item,
      invest: formatR(item.invest),
      profit: formatR(item.profit),
      rate: formatP(item.profit / item.invest),
    }));
  }
}
