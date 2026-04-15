import type { ComponentProps, FC } from "react";
import { Fragment } from "react";

import { BasicChart } from "./basic-chart";

export const FundChart: FC<ComponentProps<typeof BasicChart>> = props => {
  return (
    <Fragment>
      <BasicChart {...props} source="tencent-fund-worth" title={props.title + "(单位净值)"} />
      <BasicChart {...props} source="tencent-fund" title={props.title + "(累计净值)"} />
    </Fragment>
  );
};
