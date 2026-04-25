import type { Op } from "@block-kit/ot-json";
import { json } from "@block-kit/ot-json";
import type { Token } from "markdown-it";

export const findClosingToken = (tokens: Token[], openIdx: number) => {
  const openToken = tokens[openIdx];
  if (!openToken || !openToken.type.endsWith("_open")) {
    return -1;
  }
  const baseType = openToken.type.slice(0, -5);
  const closeType = baseType + "_close";
  // open      1
  //   open    2
  //   close   1
  // close     0
  let level = 1;
  for (let i = openIdx + 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === openToken.type) {
      level++;
    } else if (token.type === closeType) {
      if (--level === 0) return i;
    }
  }
  return -1;
};

export const normalizeBatchOps = (ops: Op[]) => {
  const copied: Op[] = ops.filter(op => op);
  for (let i = 0, len = copied.length; i < len; i++) {
    const base = copied[i];
    if (!base) continue;
    for (let k = i + 1; k < len; k++) {
      const op = copied[k];
      if (!op) continue;
      const nextOp = json.transform(op, base, "right");
      // 避免 Transform 将 Token Clone 问题
      if (nextOp) nextOp.li = op.li;
      copied[k] = nextOp as Op;
    }
  }
  return copied.filter(Boolean);
};
