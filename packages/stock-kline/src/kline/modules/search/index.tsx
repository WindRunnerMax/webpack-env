import { Select } from "@arco-design/web-react";
import { IconSearch } from "@arco-design/web-react/icon";
import { debounce, isObject, isString, Storage } from "@block-kit/utils";
import type { FC } from "react";
import { useMemo, useRef, useState } from "react";

import { searchStockData } from "../../api/search";
import { HISTORY_KEY } from "../../utils/storage";

type Option = { label: string; value: string };

export const Search: FC<{
  value: string;
  onChange: (value: string) => void;
  className?: string;
}> = props => {
  const { onChange, className } = props;
  const [options, setOptions] = useState<Option[]>([]);
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

  const onConfirm = (value: string, extra: unknown) => {
    onChange(value);
    if (isObject(extra) && isString(extra.children)) {
      const label = extra.children;
      let list = Storage.local.get<Option[]>(HISTORY_KEY) || [];
      list = list.filter(item => item.value !== value).slice(0, 56);
      list.unshift({ label, value });
      Storage.local.set(HISTORY_KEY, list);
    }
  };

  return (
    <Select
      prefix={<IconSearch />}
      size="small"
      value={props.value}
      className={className}
      placeholder="Search"
      onChange={onConfirm}
      onSearch={debounceSearch}
      options={options}
      showSearch
      loading={fetching}
      filterOption={false}
      triggerProps={{ position: "top", popupAlign: { top: 5 } }}
    ></Select>
  );
};
