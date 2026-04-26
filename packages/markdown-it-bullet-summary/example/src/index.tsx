import "./index.css";
import "@arco-design/web-react/es/style/index.less";

import MarkdownIt from "markdown-it";
import { useMemo, useState } from "react";
import ReactDOM from "react-dom";

import { markdownItBulletSummary } from "../../src/summary";
import { DEFAULT_MARKDOWN } from "./constant";

const App = () => {
  const [mode, setMode] = useState("preview");
  const [markdown, setMarkdown] = useState(DEFAULT_MARKDOWN);

  const html = useMemo(() => {
    const markdownIt = new MarkdownIt({
      html: true,
      linkify: true,
      breaks: true,
    });
    // @ts-expect-error for debugger
    window.mdIt = markdownIt;
    markdownIt.use(markdownItBulletSummary);
    if (mode === "debug") {
      const tokens = markdownIt.parse(markdown, {});
      console.log("tokens:", tokens);
      return JSON.stringify(tokens, null, 4);
    }
    if (mode === "types") {
      const tokens = markdownIt.parse(markdown, {});
      const tags: string[] = [];
      let depth = -1;
      for (const token of tokens) {
        token.nesting >= 0 && depth++;
        tags.push("··".repeat(depth) + token.type);
        token.nesting <= 0 && depth--;
      }
      return tags.join("\n");
    }
    return markdownIt.render(markdown);
  }, [markdown, mode]);

  return (
    <div className="markdown-it-container">
      <textarea
        className="markdown-it-editor"
        value={markdown}
        onChange={e => setMarkdown(e.target.value)}
      ></textarea>
      {mode === "preview" && (
        <div className="markdown-it-preview" dangerouslySetInnerHTML={{ __html: html }}></div>
      )}
      {(mode === "source" || mode === "debug" || mode === "types") && (
        <div className="markdown-it-preview markdown-it-preview-source">{html}</div>
      )}
      <div className="markdown-it-preview-mode">
        <span onClick={() => setMode("preview")}>Preview</span>
        <span onClick={() => setMode("source")}>Source</span>
        <span onClick={() => setMode("types")}>Types</span>
        <span onClick={() => setMode("debug")}>Debug</span>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
