import { writeFile } from "fs/promises";

const table: string[][] = [
  ["表格", "表格可以承载复杂内容", ""],
  [
    "- 宽度调整\n- 单元格合并",
    "> 勤学如春起之苗，不见其增，日有所长；\n>辍学如磨刀之石，不见其损，日有所亏。\n```js\nconst a = 1;\n```",
    "**重点信息**",
  ],
  [
    "- 复杂格式嵌套\n- 单元格选区操作\n- 行列操作工具栏\n- 模块化组件适配",
    "",
    "1. 有序列表\n   - 无序子项",
  ],
];

const mergeInfo: ({ top?: boolean; left?: boolean } | null)[][] = [
  [null, null, { left: true }],
  [null, null, null],
  [null, { top: true }, null],
];

const md: string[] = [];

// 原始行 -> 切分行 -> 列
for (let i = 0; i < table.length; i++) {
  const rawRow = table[i] || [];

  // 每行需要按照 \n 切分, 得到每个单元格的行内容数组
  let maxRowLength = 0;
  const rows: string[][] = [];
  for (const item of rawRow) {
    const lines = item.split("\n");
    maxRowLength = Math.max(maxRowLength, lines.length);
    rows.push(lines);
  }

  // 以切分后最长切分行数量为基准遍历
  // 先迭代切分行原因是最终拼接内容就是按行拼接, 更方便处理
  for (let j = 0; j < maxRowLength; j++) {
    const rowText: string[] = [];

    // 处理原始行每行切分后的列内容
    for (let k = 0; k < rawRow.length; k++) {
      // 此处 [k][j] 索引主要是由单元格直接切分实现
      // 若不切分则直接取 k 即可, 切分后则是 k 列的 j 行内容
      const content = rows[k]?.[j] || "";

      // 仅处理 j 为 0 的切分行, 单元格索引则为 i 行 k 列
      const merge = !j && mergeInfo[i]?.[k];
      if (merge && merge.left) {
        rowText.push("");
        continue;
      }
      if (merge && merge.top) {
        rowText.push("^^");
        continue;
      }

      // 普通单元格至少要保留一个空格, 避免与合并单元格混淆
      rowText.push(content || " ");
    }

    // 仅最后的切分行不需要添加尾合并符
    const tail = j === maxRowLength - 1 ? "" : " \\";
    md.push("|" + rowText.join("|") + "|" + tail);
  }

  // 首行后需要添加表头分隔线
  if (i === 0) {
    md.push("|" + Array(rawRow.length).fill("---").join(" | ") + "|");
  }
}

const markdown = md.join("\n");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const markdownIt = require("markdown-it");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const multiTable = require("markdown-it-multimd-table");

const mdIt = markdownIt({
  breaks: true,
});
mdIt.use(multiTable, {
  multiline: true,
  rowspan: true,
  headerless: false,
});

const html = mdIt.render(markdown);

const mdRaw = "<pre><code>" + markdown + "</code></pre>";
const processed = html.replace(/<table>/g, "<table border=1>");

writeFile("./dist/table.html", mdRaw + "\n\n" + processed);
