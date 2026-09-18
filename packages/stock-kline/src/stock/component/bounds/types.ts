/** 单个期限对应的 BP 数据 */
export interface BpDataItem {
  /** 期限，如 "1Y"、"3M" */
  age_limit: string;
  /** BP 值，字符串（可能为空字符串），如 "-0.05" */
  bp: string;
}

/** 气压计子项（按券种/评级分类） */
export interface BarometerRateItem {
  /** 类型：0-利率债，1-信用债（示例） */
  type: string;
  /** 子类型，如 "国债"、"国开"、"AAA" */
  sub_type: string;
  /** 各期限 BP 数据列表 */
  bpDataList: BpDataItem[];
}

/** data 字段 */
export interface BarometerData {
  /** 截止时间，如 "17:00" */
  deadline_time: string;
  /** 交易日，如 " 9月18日"（注意可能含前导空格） */
  trade_date: string;
  /** 星期，如 "星期五" */
  week: string;
  /** 气压计列表 */
  barometerRateItemList: BarometerRateItem[];
}

/** 顶层响应结构 */
export interface BarometerResponse {
  /** 状态码，"0" 表示成功 */
  code: string;
  /** 提示信息 */
  msg: string;
  /** 业务数据 */
  data: BarometerData;
}

/** data 字段 */
export interface RatePriceData {
  /** 利率债价格（可能是综合/基准值） */
  llz_price: string;
  /** 信用债短端价格 */
  yxz_short_price: string;
  /** 信用债长端价格 */
  yxz_long_price: string;
  /** 交易日，如 " 9月18日"（注意可能含前导空格） */
  trade_date: string;
  /** 截止时间，如 "17:00" */
  deadline_time: string;
  /** 是否处于交易时段："1"-是，"0"-否 */
  is_trading_time: string;
  /** 利率债短端价格 */
  llz_short_price: string;
  /** 利率债长端价格 */
  llz_long_price: string;
  /** 策略配置列表，可能为 null */
  tacticsConfigList: TacticsConfigItem[] | null;
}

/** 策略配置项（当前为 null，字段待后端确认，先占位） */
export interface TacticsConfigItem {
  [key: string]: unknown;
}

/** 顶层响应结构 */
export interface RatePriceResponse {
  /** 状态码，"0" 表示成功 */
  code: string;
  /** 提示信息 */
  msg: string;
  /** 业务数据 */
  data: RatePriceData;
}
