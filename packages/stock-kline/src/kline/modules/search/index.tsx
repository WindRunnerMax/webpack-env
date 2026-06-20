import { Select } from "@arco-design/web-react";
import { debounce } from "@block-kit/utils";
import type { FC } from "react";
import { useMemo, useRef, useState } from "react";

import { searchStockData } from "../../api/search";

export const Search: FC<{
  value: string;
  onChange: (value: string) => void;
  className?: string;
}> = props => {
  const { onChange, className } = props;
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [fetching, setFetching] = useState(false);
  const refFetchId = useRef<number>(0);

  const onSearch = async (query: string) => {
    const fetchId = ++refFetchId.current;
    setFetching(true);
    const data = await searchStockData(query);
    if (fetchId !== refFetchId.current) {
      return;
    }
    setOptions(data);
    setFetching(false);
  };

  const debounceSearch = useMemo(() => debounce(onSearch, 700), []);

  return (
    <Select
      size="small"
      value={props.value}
      className={className}
      placeholder="Search"
      onChange={onChange}
      onSearch={debounceSearch}
      options={options}
      showSearch
      loading={fetching}
      filterOption={false}
      triggerProps={{ position: "top", popupAlign: { top: 5 } }}
    ></Select>
  );
};
