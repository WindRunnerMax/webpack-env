/* eslint-disable @typescript-eslint/no-this-alias */
import type { P } from "@block-kit/utils/dist/es/types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const log = console.log;
const XHROSend = XMLHttpRequest.prototype.send;
const XHROOpen = XMLHttpRequest.prototype.open;
const search = new URLSearchParams(location.search);
const InitFunctionConstructor = window.Function.prototype.constructor;

if (location.host === "funddb.cn" && location.pathname === "/site/index") {
  const onOpen = function (...args: unknown[]) {
    // @ts-expect-error ...
    this._requestURL = args[1];
    // @ts-expect-error ...
    return XHROOpen.apply(this, args);
  };

  const onSend = function (this: XMLHttpRequest, body?: Document | XMLHttpRequestBodyInit | null) {
    const xhr = this;
    // @ts-expect-error ...
    const requestURL = xhr._requestURL;
    const q = search.get("_q");

    if (requestURL.includes("/v2/guzhi/showcategory") && q) {
      const getText = () => {
        try {
          const json = JSON.parse(xhr.response);
          json.data.right_list = json.data.right_list.filter((item: P.Any) => {
            log(item.gu_name);
            return item.gu_name.includes(q);
          });
          return JSON.stringify(json);
        } catch (error) {
          log(error);
        }
        return xhr.response;
      };
      Object.defineProperty(xhr, "responseText", {
        configurable: true,
        get: getText,
      });
    }
    XHROSend.apply(this, [body]);
  };

  XMLHttpRequest.prototype.open = onOpen;
  XMLHttpRequest.prototype.send = onSend;
}

if (location.host === "xueqiu.com") {
  // eslint-disable-next-line no-inner-declarations
  function hookedFunctionConstructor(...args: unknown[]) {
    if (args[0] == "debugger") {
      return function () {};
    }
    for (const arg of args) {
      if (typeof arg !== "string" || !arg.includes("debugger;")) {
        return function () {};
      }
    }
    return InitFunctionConstructor(...args);
  }
  window.Function.prototype.constructor = hookedFunctionConstructor;
}
