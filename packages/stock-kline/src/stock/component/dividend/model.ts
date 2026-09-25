import md5 from "blueimp-md5";

import { CHIVE_H } from "../../../shared/constant/env";

export const fetch10YearTreasuryBond = async () => {
  const res = await fetch(`${CHIVE_H}/v2/national/national`, {
    headers: {
      "accept": "application/json, text/plain, */*",
      "accept-language": "zh,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7",
      "content-type": "application/json;charset=UTF-8",
      "sec-ch-ua": '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "sec-gpc": "1",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(
      buildRequestData({
        code: "numb",
        year: "10",
        pe_category: "fed",
        category_type: "cz",
        region: "",
        type: "pc",
        version: "2.2.7",
        authtoken: "",
      })
    ),
    method: "POST",
    mode: "cors",
    credentials: "omit",
  });
  const data = await res.json();
  return data.data.result.series[0] as {
    name: string;
    data: [timestamp: number, percentage: number][];
  };
};

export const fetchH30269Dividend = async () => {
  const res = await fetch(`${CHIVE_H}/v2/guzhi/newtubiaolinedata`, {
    headers: {
      "accept": "application/json, text/plain, */*",
      "accept-language": "zh,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7",
      "content-type": "application/json;charset=UTF-8",
      "sec-ch-ua": '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "sec-gpc": "1",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(
      buildRequestData({
        gu_code: "h30269.CSI",
        pe_category: "xilv",
        year: 10,
        ver: "new",
        type: "pc",
        version: "2.2.7",
        authtoken: "",
      })
    ),
    method: "POST",
    mode: "cors",
    credentials: "omit",
  });

  const data = await res.json();
  return data.data.tubiao.series[1] as {
    name: string;
    data: [timestamp: number, percentage: number][];
  };
};

export const fetch930955Dividend = async () => {
  const res = await fetch(`${CHIVE_H}/v2/guzhi/newtubiaolinedata`, {
    headers: {
      "accept": "application/json, text/plain, */*",
      "accept-language": "zh,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7",
      "content-type": "application/json;charset=UTF-8",
      "sec-ch-ua": '"Chromium";v="106", "Google Chrome";v="106", "Not;A=Brand";v="99"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "sec-gpc": "1",
    },
    referrerPolicy: "no-referrer",
    body: JSON.stringify(
      buildRequestData({
        gu_code: "930955.CSI",
        pe_category: "xilv",
        year: 10,
        ver: "new",
        type: "pc",
        version: "2.2.7",
        authtoken: "",
      })
    ),
    method: "POST",
    mode: "cors",
    credentials: "omit",
  });
  const data = await res.json();
  return data.data.tubiao.series[1] as {
    name: string;
    data: [timestamp: number, percentage: number][];
  };
};

/** 盐值：来自 app.js 的 p.a.fklreialk = u.pro.req_key */
const SALT = "EWf45rlv#kfsr@k#gfksgkr";

/**
 * 字段名 -> md5 十六进制串的切片位置 [start, length]
 * 与 app.js 中 base(...) 的参数顺序及各处 u.substr(...) 一一对应
 */
const FIELD_MAP: Record<string, [number, number]> = {
  tirgkjfs: [0, 2],
  u54rg5d: [2, 2],
  tiklsktr4: [1, 1],
  kf54ge7: [31, 1],
  bioduytlw: [5, 1],
  nkjhrew: [26, 1],
  bvytikwqjk: [6, 2],
  h67456y: [16, 3],
  tbvdiuytk: [16, 1],
  yi854tew: [29, 2],
  nbf4uj7y432: [21, 2],
  abiokytke: [21, 2],
  bd24y6421f: [24, 2],
  iogojti: [25, 1],
  ngd4yut78: [12, 2],
  ibvytiqjek: [14, 2],
  h13ey474: [29, 3],
  nd354uy4752: [30, 1],
  bgiuytkw: [9, 2],
  quikgdky: [27, 2],
  ngd4uy551: [17, 2],
  n3bf4uj7y7: [18, 1],
  bgd7h8tyu54: [6, 2],
  ghtoiutkmlg: [11, 3],
  bd4uy742: [26, 1],
  lksytkjh: [17, 4],
  sbnoywr: [23, 2],
  hy5641d321t: [25, 2],
  yt447e13f: [8, 1],
  y654b5fs3tr: [11, 1],
  fjlkatj: [2, 3],
  jnhf8u5231: [9, 2],
};

/**
 * 生成带签名的请求体（复现 app.js 的签名逻辑）
 * @param base 业务参数（不含 32 个签名字段）
 * @param actTime 毫秒时间戳，默认取当前时间
 */
export function buildRequestData(
  base: Record<string, unknown>,
  actTime: number = Date.now()
): Record<string, unknown> {
  const data: Record<string, unknown> = { ...base, act_time: actTime };

  // 1) key 字典序排序 + 拼接（跳过对象；空字符串拼接无影响）
  let plain = "";
  for (const key of Object.keys(data).sort()) {
    const v = data[key];
    if (v == null || typeof v === "object") continue;
    if (!v && v !== 0) continue; // 对应 JS: !v && 0 != v
    plain += String(v);
  }

  // 2) 加盐 -> md5
  const digest = md5(plain + SALT);

  // 3) 按映射切片填入签名字段
  for (const [field, [start, len]] of Object.entries(FIELD_MAP)) {
    data[field] = digest.slice(start, start + len);
  }
  return data;
}
