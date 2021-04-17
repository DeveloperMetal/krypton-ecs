const fs = require("fs/promises");
const path = require("path");
const utils = require("util");
const exec = utils.promisify(require("child_process").exec);

async function configureModule(modulePath, moduleName) {
  const tsConfigPath = path.join(modulePath, "tsconfig.json");
  try {
    const stat = await fs.stat(tsConfigPath);
  } catch (e) {
    await fs.writeFile(tsConfigPath, JSON.stringify({
      extends: "./tsconfig.json",
      compilerOptions: {
        outDir: path.resolve(".", moduleName),
      }
    }));
  }

  return tsConfigPath;
}

async function main() {
  const modulesDir = path.join(".", "modules");
  const moduleNames = await fs.readdir(path.join(".", "modules"));
  for (const moduleName of moduleNames) {
    const modulePath = path.join(modulesDir, moduleName)
    console.log("-- ", modulePath);
    const stat = await fs.stat(modulePath);
    if ( stat.isDirectory() ) {
      const moduleConfigPath = configureModule(modulePath, moduleName);
      await exec(path.join(".", "node_modules", ".bin", `tsc -p ${moduleConfigPath} ${modulePath}/index.ts`));
    }
  }
}

main();