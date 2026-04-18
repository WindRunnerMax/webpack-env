import type { P } from "@block-kit/utils/dist/es/types";

const InitFunctionConstructor = window.Function.prototype.constructor;

export const callSnowHook = () => {
  // eslint-disable-next-line no-inner-declarations
  function hookedFunctionConstructor(this: P.Any, ...args: unknown[]) {
    const fnString = args[2] as string;
    const FROM = "debugger;";
    const TO = "/** debugger **/;";
    const isDebuggerStatement = fnString.includes(FROM);
    if (isDebuggerStatement) {
      args[2] = fnString.replace(FROM, TO);
    }
    const fn = InitFunctionConstructor.apply(this, args);
    if (isDebuggerStatement) {
      const callString = fn.toString();
      fn.toString = () => callString.replace(TO, FROM);
    }
    return fn;
  }
  window.Function.prototype.constructor = hookedFunctionConstructor;
};
