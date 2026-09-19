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
    body: '{"code":"numb","year":"10","pe_category":"fed","category_type":"cz","region":"","type":"pc","version":"2.2.7","authtoken":"","act_time":1789743268262,"tirgkjfs":"5a","abiokytke":"5a","u54rg5d":"2c","kf54ge7":"5","tiklsktr4":"a","lksytkjh":"760d","sbnoywr":"37","bgd7h8tyu54":"95","y654b5fs3tr":"a","bioduytlw":"2","bd4uy742":"d","h67456y":"c76","bvytikwqjk":"95","ngd4uy551":"76","bgiuytkw":"49","nd354uy4752":"3","ghtoiutkmlg":"afc","bd24y6421f":"72","tbvdiuytk":"c","ibvytiqjek":"e6","jnhf8u5231":"49","fjlkatj":"2c5","hy5641d321t":"2d","iogojti":"2","ngd4yut78":"fc","nkjhrew":"d","yt447e13f":"d","n3bf4uj7y7":"6","nbf4uj7y432":"5a","yi854tew":"83","h13ey474":"835","quikgdky":"a7"}',
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
    body: '{"gu_code":"h30269.CSI","pe_category":"xilv","year":10,"ver":"new","type":"pc","version":"2.2.7","authtoken":"","act_time":1789743125039,"tirgkjfs":"c8","abiokytke":"45","u54rg5d":"00","kf54ge7":"c","tiklsktr4":"8","lksytkjh":"0b32","sbnoywr":"e5","bgd7h8tyu54":"bd","y654b5fs3tr":"3","bioduytlw":"8","bd4uy742":"e","h67456y":"40b","bvytikwqjk":"bd","ngd4uy551":"0b","bgiuytkw":"fa","nd354uy4752":"3","ghtoiutkmlg":"39f","bd24y6421f":"54","tbvdiuytk":"4","ibvytiqjek":"5b","jnhf8u5231":"fa","fjlkatj":"009","hy5641d321t":"4e","iogojti":"4","ngd4yut78":"9f","nkjhrew":"e","yt447e13f":"6","n3bf4uj7y7":"b","nbf4uj7y432":"45","yi854tew":"d3","h13ey474":"d3c","quikgdky":"f3"}',
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
    body: '{"gu_code":"930955.CSI","pe_category":"xilv","year":10,"ver":"new","type":"pc","version":"2.2.7","authtoken":"","act_time":1789743369530,"tirgkjfs":"ab","abiokytke":"41","u54rg5d":"b6","kf54ge7":"0","tiklsktr4":"b","lksytkjh":"7f81","sbnoywr":"22","bgd7h8tyu54":"a5","y654b5fs3tr":"3","bioduytlw":"6","bd4uy742":"e","h67456y":"17f","bvytikwqjk":"a5","ngd4uy551":"7f","bgiuytkw":"55","nd354uy4752":"9","ghtoiutkmlg":"347","bd24y6421f":"27","tbvdiuytk":"1","ibvytiqjek":"98","jnhf8u5231":"55","fjlkatj":"b67","hy5641d321t":"7e","iogojti":"7","ngd4yut78":"47","nkjhrew":"e","yt447e13f":"d","n3bf4uj7y7":"f","nbf4uj7y432":"41","yi854tew":"e9","h13ey474":"e90","quikgdky":"04"}',
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
