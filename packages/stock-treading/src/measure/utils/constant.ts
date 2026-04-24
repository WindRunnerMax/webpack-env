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

export const PRESET_50 = {
  "base": "CSIH30269",
  "etf": "SH563020",
  "start": "2025-01-01",
  "ma": 250,
  "offset": 0.004,
  "light.min": 50,
  "light.radix": 100,
  "light.max": 5000,
  "heavy.min": 10000,
  "heavy.radix": 1000,
  "heavy.max": 20000,
  "loc": "left",
};

export const PRESET_100 = {
  "base": "CSI930955",
  "etf": "SZ159307",
  "start": "2025-01-01",
  "ma": 200,
  "offset": 0.006,
  "light.min": 50,
  "light.radix": 100,
  "light.max": 5000,
  "heavy.min": 10000,
  "heavy.radix": 1000,
  "heavy.max": 20000,
  "loc": "left",
};
