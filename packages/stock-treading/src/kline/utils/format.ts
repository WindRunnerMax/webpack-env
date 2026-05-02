export const formatNumber = (num: number, precision = 2, withSign = true) => {
  if (isNaN(num)) return "n/a";
  const sign = num > 0 ? "+" : "";
  return withSign ? sign + num.toFixed(precision) : num.toFixed(precision);
};
