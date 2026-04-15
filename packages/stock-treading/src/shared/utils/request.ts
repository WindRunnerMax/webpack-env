export const getIPv4 = () => {
  return Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join(".");
};

export const getHeaders = () => {
  const ip = getIPv4();
  return {
    "X-REAL-IP": ip,
    "CLIENT-IP": ip,
    "X-FORWARDED-FOR": ip,
  };
};
