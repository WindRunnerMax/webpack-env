import { DateTime } from "@block-kit/utils";

export type PresetFormTypes = {
  start: string;
  end: string;
  base: string;
  etf: string;
  ma: number;
  offset: number;
  threshold: number;
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
export const START_DATE = start.format();
export const END_DATE = new DateTime().format();

const COMMON_PRESET = {
  light: {
    min: 10,
    radix: 10,
    max: 100,
  },
  heavy: {
    min: 100,
    radix: 500,
    max: 20000,
  },
  loc: "left",
  threshold: 0.003,
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
  offset: 0.004,
  ...COMMON_PRESET,
};

export const PRESET_100_2 = {
  base: "CSI930955",
  etf: "SZ159549",
  ma: 200,
  offset: 0,
  ...COMMON_PRESET,
};
