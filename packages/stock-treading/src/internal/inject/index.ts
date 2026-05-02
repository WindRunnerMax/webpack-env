import { callChiveHook } from "./chive";
import { callSnowHook } from "./snow";

console.clear = () => void 0;

if (location.host === "funddb.cn" && location.pathname === "/site/index") {
  callChiveHook();
}

if (location.host === "xueqiu.com") {
  callSnowHook();
}
