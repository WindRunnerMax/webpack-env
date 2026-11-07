/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const log = console.log;
const Fetch = window.fetch;
const XHRSend = XMLHttpRequest.prototype.send;
const XHROpen = XMLHttpRequest.prototype.open;
const search = new URLSearchParams(location.search);

log(333);

export const callChiveHook = () => {
  const q = search.get("_q");

  const onOpen = function (...args: unknown[]) {
    // @ts-expect-error ...
    this._requestURL = args[1];
    // @ts-expect-error ...
    return XHROpen.apply(this, args);
  };

  const onSend = function (this: XMLHttpRequest, body?: Document | XMLHttpRequestBodyInit | null) {
    const xhr = this;
    // @ts-expect-error ...
    const requestURL = xhr._requestURL;

    if (requestURL.includes("/v2/guzhi/showcategory") && q) {
      const getText = () => {
        try {
          const json = JSON.parse(xhr.response);
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
    XHRSend.apply(this, [body]);
  };

  const onFetch: typeof fetch = async function (
    input: string | URL | globalThis.Request,
    init?: RequestInit
  ) {
    // @ts-expect-error ...
    const res = await Fetch.apply(this, [input, init]);
    if (typeof input === "string" && input.includes("/api/index-valuation?category=zt") && q) {
      const data = await res.json();
      data.rows = data.rows.filter((item: any) => item.name.includes(q));
      return new Response(JSON.stringify(data), {
        status: res.status,
        statusText: res.statusText,
        headers: res.headers,
      });
    }
    return res;
  };

  globalThis.fetch = onFetch;
  XMLHttpRequest.prototype.open = onOpen;
  XMLHttpRequest.prototype.send = onSend;
};
