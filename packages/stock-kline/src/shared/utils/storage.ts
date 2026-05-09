import { decode, encode } from "@block-kit/utils/dist/es/json";

interface Storage<T> {
  /** 原始值 */
  origin: T;
  /** 过期时间 ttl ms */
  expire: number | null;
}

/**
 * 序列化
 * @param {T} origin
 * @param {number} ttl ms
 * @returns {string | null}
 * */
const serialize = <T = string>(origin: T, ttl?: number | null): string | null => {
  try {
    const data: Storage<T> = { origin, expire: null };
    if (ttl) {
      const now = Date.now();
      data.expire = ttl + now;
    }
    return encode(data);
  } catch (error) {
    console.log("Serialize Storage Error:", error);
    return null;
  }
};

/**
 * 反序列化
 * @param {string} str
 * @returns {null | T}
 * */
const deserialize = <T>(str: string): null | T => {
  try {
    const data = decode<Storage<T>>(str);
    if (!data) return null;
    if (Number.isNaN(data.expire)) return null;
    if (data.expire && Date.now() > data.expire) return null;
    return data.origin;
  } catch (error) {
    console.log("Deserialize Storage Error:", error);
    return null;
  }
};

export const storage = {
  get: async <T = unknown>(key: string) => {
    const record = await chrome.storage.local.get([key]);
    if (!record || !record[key]) return null;
    const origin = deserialize<T>(record[key]);
    if (origin === null) {
      await storage.remove(key);
    }
    return origin;
  },
  set: async (key: string, value: unknown, ttl?: number) => {
    return await chrome.storage.local.set({ [key]: serialize(value, ttl) });
  },
  remove: async (key: string) => {
    return await chrome.storage.local.remove(key);
  },
};
