import type { Token } from "markdown-it";

/**
 * 同级节点迭代器 [open, close]
 */
export function* createSectionWalker(
  tokens: Token[],
  openIdx: number
): Generator<{
  /** 节点 */
  token: Token;
  /** 深度 [0-N] */
  depth: number;
  /** 索引 [openIdx, closeIdx] */
  idx: number;
  /** 序列 [0, closeIdx - openIdx] */
  serial: number;
}> {
  const openToken = tokens[openIdx];
  if (!openToken || openToken.nesting !== 1) return void 0;
  let depth = 0;
  for (let i = openIdx; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.nesting >= 0) {
      depth++;
    }
    yield { token, depth: depth - 1, idx: i, serial: i - openIdx };
    if (token.nesting <= 0) {
      depth--;
      if (depth <= 0) break;
    }
  }
  return void 0;
}

/**
 * 查找同级节点的关闭节点
 */
export const findClosingToken = (tokens: Token[], openIdx: number) => {
  const openToken = tokens[openIdx];
  if (!openToken || !openToken.type.endsWith("_open")) {
    return -1;
  }
  const baseType = openToken.type.slice(0, -5);
  const closeType = baseType + "_close";
  // open      1
  // start iterator
  //   open    2
  //   close   1
  // close     0
  // end iterator
  let level = 1;
  for (let i = openIdx + 1; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === openToken.type) {
      level++;
    } else if (token.type === closeType) {
      level--;
      if (level <= 0) return i;
    }
  }
  return -1;
};
