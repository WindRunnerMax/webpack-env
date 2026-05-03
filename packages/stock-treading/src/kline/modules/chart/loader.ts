import { DateTime } from "@block-kit/utils";
import type { DataLoader, DataLoaderSubscribeBarParams } from "klinecharts";

import { getStockData } from "../../api/stock";

const DEFAULT_COUNT = 500;

export const getStockLoader = (code: string): DataLoader => {
  const today = new DateTime();
  let timer: NodeJS.Timeout | null = null;
  let latestCallback: DataLoaderSubscribeBarParams["callback"] | null = null;

  const fetchLatestDate = async () => {
    const data = await getStockData(code, today, -1);
    const latest = data[0];
    if (latest && latestCallback) {
      latestCallback(latest);
      timer = setTimeout(() => fetchLatestDate(), 5000);
    }
  };

  return {
    async getBars(params) {
      let start = today.clone();
      if (params.type === "forward") {
        const newDate = new DateTime(params.timestamp!);
        newDate.nextDay(-1);
        start = newDate;
      }

      const data = await getStockData(code, start, -DEFAULT_COUNT);
      params.callback(data, { forward: !!data.length, backward: false });

      const lastDayDate = data[data.length - 1];
      if (lastDayDate && new DateTime(lastDayDate.timestamp).format() === today.format()) {
        fetchLatestDate();
      }
    },
    subscribeBar(params) {
      latestCallback = params.callback;
    },
    unsubscribeBar() {
      timer && clearTimeout(timer);
      timer = null;
      latestCallback = null;
    },
  };
};
