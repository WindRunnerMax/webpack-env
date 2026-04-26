import { DateTime } from "@block-kit/utils";

export type PresetFormTypes = {
  base: string;
  etf: string;
  start: string;
  ma: number;
  offset: number;
  light: {
    min: number;
    radix: number;
    max: number;
  };
  heavy: {
    min: number;
    radix: number;
    max: number;
  };
  loc: string;
};

const start = new DateTime();
start.setFullYear(start.getFullYear() - 1);

const COMMON_PRESET = {
  "start": start.format(),
  "light.min": 50,
  "light.radix": 100,
  "light.max": 5000,
  "heavy.min": 10000,
  "heavy.radix": 1000,
  "heavy.max": 20000,
  "loc": "left",
};

export const PRESET_50_1 = {
  base: "CSIH30269",
  etf: "SH563020",
  ma: 250,
  offset: 0.004,
  ...COMMON_PRESET,
};

export const PRESET_50_2 = {
  base: "CSIH30269",
  etf: "SH512890",
  ma: 250,
  offset: 0,
  ...COMMON_PRESET,
};

export const PRESET_100_1 = {
  base: "CSI930955",
  etf: "SZ159307",
  ma: 200,
  offset: 0.006,
  ...COMMON_PRESET,
};

export const PRESET_100_2 = {
  base: "CSI930955",
  etf: "SZ159549",
  ma: 200,
  offset: 0,
  ...COMMON_PRESET,
};
