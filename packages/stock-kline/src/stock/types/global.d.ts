declare module "*.m.less" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.less" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "blueimp-md5" {
  /**
   * 计算字符串 / 值的 MD5 哈希
   * @param value 要哈希的值
   * @param key 可选的 HMAC 密钥（传入则计算 HMAC-MD5）
   * @param raw 为 true 时返回原始二进制字符串，默认 false 返回 hex
   */
  function md5(value: string | number | object, key?: string | null, raw?: boolean): string;

  export = md5;
}
