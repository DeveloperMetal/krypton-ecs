import fs from "fs/promises";
import path from "path";
import utils from "util";
import { exec as execOld } from "child_process";
const exec = utils.promisify(execOld);

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
  const modulesDir = await fs.readdir(path.join(".", "modules"));
  for(modPath in modulesDir) {
    console.log("-- ", modPath);
    const stat = await fs.stat(modPath);
    if ( stat.isDirectory() ) {
      const moduleConfigPath = configureModule(path.join(modulesDir, modPath), modPath);
      await exec(`tsc -p ${moduleConfigPath}`);
    }
  }
}

main();