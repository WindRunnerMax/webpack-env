import type { PluginSimple } from "markdown-it";

export const markdownItBulletSummary: PluginSimple = mdIt => {
  mdIt.core.ruler.push("bullet_summary", state => {
    console.log("state :>> ", state);
  });
};
