/**
 * 拟合一次函数 y = kx + b
 * @param p1 - 第一个点 [x1, y1]
 * @param p2 - 第二个点 [x2, y2]
 */
export function fitLinear(p1: [number, number], p2: [number, number]) {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  const k = (y2 - y1) / (x2 - x1);
  const b = y1 - k * x1;
  return (x: number) => k * x + b;
}

/**
 * 拟合指数函数 y = A * exp(B * x)  或写作 y = A * C^x
 * 要求所有 y > 0
 * @param p1 - 第一个点 [x1, y1]
 * @param p2 - 第二个点 [x2, y2]
 */
export function fitExponential(p1: [number, number], p2: [number, number]) {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  // 注意：y1, y2 必须为正数，否则 Math.log 报错
  const B = (Math.log(y2) - Math.log(y1)) / (x2 - x1);
  const A = y1 / Math.exp(B * x1);
  return (x: number) => A * Math.exp(B * x);
}
