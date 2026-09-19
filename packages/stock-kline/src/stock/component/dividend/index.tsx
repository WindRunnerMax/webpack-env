import type { FC } from "react";
import { useEffect } from "react";

import { fetch10YearTreasuryBond, fetch930955Dividend, fetchH30269Dividend } from "./model";

export const Dividend: FC = () => {
  useEffect(() => {
    fetch10YearTreasuryBond().then(data => {
      console.log(data);
    });
    fetchH30269Dividend().then(data => {
      console.log(data);
    });
    fetch930955Dividend().then(data => {
      console.log(data);
    });
  }, []);

  return <div>Dividend</div>;
};
