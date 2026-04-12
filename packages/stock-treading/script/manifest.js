const path = require("path");
const tsNode = require("ts-node");
const fs = require("fs/promises");

exports.ManifestPlugin = class ManifestPlugin {
  constructor() {
    tsNode.register();
    this.manifest = path.resolve(`src/modules/manifest.ts`);
  }

  apply(compiler) {
    compiler.hooks.make.tap("ManifestPlugin", compilation => {
      const manifest = this.manifest;
      !compilation.fileDependencies.has(manifest) && compilation.fileDependencies.add(manifest);
    });

    compiler.hooks.done.tapPromise("ManifestPlugin", () => {
      delete require.cache[require.resolve(this.manifest)];
      const manifest = require(this.manifest);
      const version = require(path.resolve("package.json")).version;
      manifest.version = version;
      const folder = "build";
      return fs.writeFile(
        path.resolve(`${folder}/manifest.json`),
        JSON.stringify(manifest, null, 2)
      );
    });
  }
};
