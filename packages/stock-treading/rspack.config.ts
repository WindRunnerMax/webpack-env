import type { Configuration } from "@rspack/cli";
import { default as HtmlPlugin } from "@rspack/plugin-html";
import path from "path";

import { FilesPlugin } from "./script/files";
import { ManifestPlugin } from "./script/manifest";

/**
 * @type {import("@rspack/cli").Configuration}
 * - https://www.rspack.dev/
 */
const config: Configuration = {
  context: __dirname,
  entry: {
    stock: "./src/index.tsx",
    worker: "./src/worker.ts",
  },
  plugins: [
    new HtmlPlugin({
      filename: "stock.html",
      template: "./public/stock.html",
      inject: false,
    }),
    new FilesPlugin(),
    new ManifestPlugin(),
  ],
  builtins: {
    define: {
      __DEV__: JSON.stringify(process.env.NODE_ENV === "development"),
    },
    pluginImport: [
      {
        libraryName: "@arco-design/web-react",
        customName: "@arco-design/web-react/es/{{ member }}",
        style: true,
      },
    ],
  },
  module: {
    rules: [
      { test: /\.svg$/, type: "asset" },
      {
        test: /\.(m|module).scss$/,
        use: [{ loader: "sass-loader" }],
        type: "css/module",
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: "less-loader",
            options: {
              lessOptions: {
                javascriptEnabled: true,
                importLoaders: true,
                localIdentName: "[name]__[hash:base64:5]",
              },
            },
          },
        ],
        type: "css",
      },
    ],
  },
  output: {
    publicPath: "/",
    filename: "[name].js",
    path: path.resolve(__dirname, "build"),
  },
  devtool: false,
};

export default config;
