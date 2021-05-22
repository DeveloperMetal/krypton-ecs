import { IECSSchema } from "../schema/types";
import { parseYaml } from "../parsers/yaml";
import { IGeneratorArgs } from "./types";
import findup from "findup-sync";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { generate as generateInterfaces } from "./generators/interfaces";
import { generate as generateSchema } from "./generators/schema";

async function installPackages(packages: { url: string, name: string }[]) {
  return new Promise<void>(async (resolve, reject) => {
    const packagesToInstall: string[] = [];
    for (const dep of packages) {
      try {
        require(dep.name);
      } catch (err) {
        // tslint:disable-next-line: no-console
        console.log("Module not found: ", dep.name);
        packagesToInstall.push(dep.url);
      }
    }

    if ( packagesToInstall.length === 0 ) {
      return resolve();
    }

    let cmd = `npm i -s ${packagesToInstall.join(' ')}`;

    if ( await usesYarn() ) {
      cmd = `yarn add ${packagesToInstall.join(' ')}`;
    }

    exec(cmd, (error, stdout, stderr) => {
      if ( error ) {
        // tslint:disable-next-line: no-console
        console.log(stdout);
        // tslint:disable-next-line: no-console
        console.log(stderr);
        reject(error);
        return;
      }

      // tslint:disable-next-line: no-console
      console.log(stdout);
      resolve();
    })
  });
}

async function usesYarn(cwd = process.cwd()) {
  try {
    const stat = await fs.stat(path.resolve(cwd, 'yarn.lock'))
    return stat.isFile();
  } catch(err) {
    return false;
  }
}


function generateCode(data: IECSSchema) {
  const src = `// Component and Entity Schema ////////////////////////////////////////////////
${generateSchema(data)}

module.exports = {
  schema: componentSchemas
}
`;

  return src;
}

function generateTypes(data: IECSSchema) {
  const src = `import { IECSSchema, IComponentDefinition } from '@kryptonstudio/ecs';

// Component Interfaces //////////////////////////////////////////////////////
${generateInterfaces(data)}

export declare const schema: IECSSchema;
`;

  return src;
}

export default async function (argv: IGeneratorArgs) {
  const data: IECSSchema = {
    components: [],
    entities: []
  };

  try {
    // tslint:disable-next-line: no-console
    console.log("-- Loading: ", argv.i);
    await parseYaml(argv.i, data);
  } catch(err) {
    // tslint:disable-next-line: no-console
    console.log("-- Error parsing yaml ---------------")
    // tslint:disable-next-line: no-console
    console.error(err);
    return;
  }
  // tslint:disable-next-line: no-console
  const src = generateCode(data);
  const types = generateTypes(data);

  const packageJsonPath = findup("package.json");
  if ( !packageJsonPath ) {
    throw Error("Could not determine project root directory.");
  }

  let outputPath = path.resolve(path.join(path.dirname(packageJsonPath), '.kecs'));
  await fs.mkdir(outputPath, {
    recursive: true
  });

  if ( argv.o ) {
    try {
      await fs.stat(argv.o);
      outputPath = argv.o;
    } catch(ex) {
      // tslint:disable-next-line: no-console
      console.log(ex);
      await fs.mkdir(argv.o, { recursive: true });
    }
  }

  if ( src && outputPath) {
    // tslint:disable-next-line: no-console
    console.log("Writing client to: ", outputPath);
    await fs.writeFile(path.join(outputPath, 'index.js'), src, { encoding: "utf-8" });
    await fs.writeFile(path.join(outputPath, 'index.d.ts'), types, { encoding: "utf-8" });
    installPackages([]);// { url: 'DeveloperMetal/kecs-client.git#master', name: "@kryptonstudio/ecs-client"}]);
    // tslint:disable-next-line: no-console
    console.log("Client Generated.");
  } else {
    // tslint:disable-next-line: no-console
    console.error("Something went wrong. No output path or source generated...");
  }
}