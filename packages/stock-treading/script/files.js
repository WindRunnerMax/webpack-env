const thread = require("child_process");
const path = require("path");
const fs = require("fs/promises");

const exec = command => {
  return new Promise((resolve, reject) => {
    thread.exec(command, (err, stdout) => {
      if (err) reject(err);
      resolve(stdout);
    });
  });
};

exports.FilesPlugin = class FilesPlugin {
  constructor() {
    const folder = "build";
    fs.mkdir(`${folder}/static`, { recursive: true });
  }

  apply(compiler) {
    compiler.hooks.make.tap("FilesPlugin", compilation => {
      const resources = path.resolve("public/static");
      !compilation.contextDependencies.has(resources) &&
        compilation.contextDependencies.add(resources);
    });

    compiler.hooks.done.tapPromise("FilesPlugin", () => {
      const resources = path.resolve("public/static");

      const folder = "build";
      const resourcesTarget = path.resolve(`${folder}/static`);

      return Promise.all([exec(`cp -r ${resources}/* ${resourcesTarget}`)]);
    });
  }
};
