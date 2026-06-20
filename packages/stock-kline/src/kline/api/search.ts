import { getHeaders } from "../../shared/utils/request";

export const searchStockData = async (query: string) => {
  if (!query) {
    return [];
  }
  const res = await fetch(
    `https://xueqiu.com/query/v1/search/web/stock.json?q=${query}&size=20&page=1`,
    {
      headers: getHeaders(),
    }
  );
  const data: { list: { code: string; name: string }[] } = await res.json();
  return (
    data.list?.map(item => ({
      label: item.name,
      value: item.code,
    })) || []
  );
};
