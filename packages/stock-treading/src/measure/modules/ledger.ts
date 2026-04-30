import { formatP, formatR } from "../utils/kline";

type Invest = { date: string; amount: number; profit: number };

export class Ledger {
  /** 历史投入总金额 */
  public amount: number = 0;
  /** 历史收益总金额 */
  public profit: number = 0;
  /** 历史投入记录 */
  public invests: Invest[] = [];

  /**
   * 执行资金涨跌
   * - rate = (close - lastClose) / lastClose
   */
  public moveRate(rate: number) {
    const balanceChange = (this.amount + this.profit) * rate;
    this.profit = this.profit + balanceChange;
    this.invests.forEach(item => {
      item.profit = item.profit + (item.amount + item.profit) * rate;
    });
    return balanceChange;
  }

  /**
   * 增加投资记录
   */
  public addInvest(date: string, invest: number) {
    this.invests.push({ date, amount: invest, profit: 0 });
    this.amount = this.amount + invest;
  }

  /**
   * 格式化收益率
   */
  public formatReturnRate() {
    return formatP(this.amount ? this.profit / this.amount : 0);
  }

  /**
   * 格式化投资记录
   */
  public formatInvests() {
    return this.invests.map(item => ({
      ...item,
      profit: formatR(item.profit),
      rate: formatP(item.profit / item.amount),
    }));
  }
}
