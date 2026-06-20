/**
 * 计算补仓金额（持仓按当前市值计）
 * @param {number} currentValue  当前持仓市值（元）
 * @param {number} costPrice     当前成本价
 * @param {number} currentNav    当前基金净值
 * @param {number} targetCost    希望达到的目标成本价
 * @returns {number} 需要加仓的金额（元）
 */
function calcAddAmount(
  currentValue: number,
  costPrice: number,
  currentNav: number,
  targetCost: number
): number {
  // 成本价和净值单位需一致（例如都是元）
  if (targetCost >= costPrice) {
    throw new Error("目标成本价必须低于当前成本价，补仓才能降低成本");
  }
  if (currentNav >= targetCost) {
    throw new Error("当前净值必须低于目标成本价，否则无法通过补仓达到目标");
  }
  // 公式推导：加仓金额 = 当前市值 × (目标成本 - 原成本) / (当前净值 - 目标成本)
  const addAmount = (currentValue * (targetCost - costPrice)) / (currentNav - targetCost);
  return addAmount;
}

const 当前市值 = 100; // 你的持仓市值
const 当前成本价 = 80; // 成本价
const 当前净值 = 20; // 基金现在净值
const 目标成本价 = 60; // 你想降到的成本

const 需要加仓 = calcAddAmount(当前市值, 当前成本价, 当前净值, 目标成本价);
console.log(`需要加仓 ${需要加仓} 元`);

export {};
