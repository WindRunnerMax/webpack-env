const 当前市值 = 1000;
const 持仓收益 = 100;
const 持有份额 = 900;

const 持仓成本 = 当前市值 - 持仓收益;
const 单位成本 = 持仓成本 / 持有份额;
const 收益率 = 持仓收益 / 持仓成本;

console.log(`持仓成本 ${持仓成本}`);
console.log(`单位成本 ${单位成本}`);
console.log(`收益率 ${收益率}`);

export {};
