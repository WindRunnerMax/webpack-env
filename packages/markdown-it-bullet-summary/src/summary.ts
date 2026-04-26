import type { PluginWithOptions, StateCore } from "markdown-it";
import type { Token } from "markdown-it";

import { BULLET_SUMMARY } from "./constant";
import { createSectionWalker, findClosingToken } from "./utils";

export const markdownItBulletSummary: PluginWithOptions<{
  identifier?: string;
}> = (mdIt, options) => {
  const { identifier = BULLET_SUMMARY } = options || {};
  mdIt.core.ruler.push("bullet_summary", state => {
    for (let i = 0; i < state.tokens.length; i++) {
      const prevToken = state.tokens[i - 1];
      const token = state.tokens[i];
      const nextToken = state.tokens[i + 1];
      const nextStep2Token = state.tokens[i + 2];
      // paragraph_open
      //   inline: @bullet-summary
      // paragraph_close
      // bullet_list_open
      if (
        token.content === identifier &&
        token.type === "inline" &&
        nextToken &&
        nextStep2Token &&
        nextToken.type === "paragraph_close" &&
        nextStep2Token.type === "bullet_list_open"
      ) {
        prevToken && (prevToken.hidden = true);
        (token.hidden = true) && (token.children = []);
        nextToken && (nextToken.hidden = true);
        rebuildUlTokens(state, i + 2);
      }
    }
  });
};

export const rebuildUlTokens = (state: StateCore, startIdx: number) => {
  const tokens = state.tokens;
  const closeIdx = findClosingToken(tokens, startIdx);
  if (closeIdx === -1) return void 0;
  const stack: Token[] = [];
  const actions: { idx: number; token: Token }[] = [];
  // 从后向前遍历, 避免修改后, 影响后续 i 遍历
  for (let i = closeIdx; i >= startIdx; i--) {
    const token = tokens[i];
    // 修改 ul 的 open dom attrs
    if (token.type === "bullet_list_open") {
      token.attrJoin("class", "bullet-summary-group");
    }
    if (token.type === "list_item_close") {
      stack.push(token);
    }
    if (token.type === "list_item_open") {
      const peer = stack.pop();
      rebuildLiTokens(state, i, peer, actions);
    }
  }
  // 按索引从大到小排序, 后索引的元素, 不影响前索引的元素
  actions
    .sort((a, b) => b.idx - a.idx)
    .forEach(action => {
      tokens.splice(action.idx, 0, action.token);
    });
};

export const rebuildLiTokens = (
  state: StateCore,
  openIdx: number,
  peer: Token | undefined,
  actions: { idx: number; token: Token }[]
) => {
  const tokens = state.tokens;
  const liToken = tokens[openIdx]!;
  const walker = createSectionWalker(tokens, openIdx);
  // 查找 li 下的子项, 此处是向后查找, 插入不影响 i 遍历
  for (const node of walker) {
    const k = node.idx;
    const tokenK = node.token;
    if (node.depth !== 1) continue;
    // 直属的 ul 子项, 若是存在则需要转换为 details 组
    if (tokenK.type === "bullet_list_open") {
      // i 的 li 元素需要变为 details 元素
      liToken.type = "li_details_open";
      liToken.tag = "details";
      // 为 i - k 之间的元素创建 summary
      const sOpen = new state.Token("li_summary_open", "summary", 1);
      const sClose = new state.Token("li_summary_close", "summary", -1);
      sOpen.level = liToken.level + 1;
      sClose.level = liToken.level + 1;
      actions.push({ idx: openIdx + 1, token: sOpen });
      actions.push({ idx: k, token: sClose });
      // 现在是 i 之后的元素, 不会影响原始遍历 li 的栈平衡
      if (peer) {
        peer.type = "li_details_close";
        peer.tag = "details";
      }
      break;
    }
  }
};
