import { IECSSchema } from "../schema/types";
import { parseYaml } from "../parsers/yaml";
import { IGeneratorArgs } from "./types";
import findup from "findup-sync";
import fs from "fs/promises";
import path from "path";
import { JSGenerator, TSTypesGenerator } from "./utils";
import { generate as generateInterfaces } from "./generators/interfaces";
import { generate as generateSchema } from "./generators/schema";
import { generate as generateClient } from "./generators/client";
import { generate as generateClientTypes } from "./generators/clientTypes";

function generateCode(data: IECSSchema) {
  const js = new JSGenerator();
  js.collect(generateSchema(data));
  js.collect(generateClient(data));
  return js.generateSrc();
}

function generateTypes(data: IECSSchema) {
  const ts = new TSTypesGenerator();
  ts.collect(generateInterfaces(data));
  ts.collect(generateClientTypes(data));
  return ts.generateSrc();
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
  const schemaSrc = generateCode(data);
  const schemaSrcTypes = generateTypes(data);

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

  if ( schemaSrc && outputPath) {
    const schemaOutputPath = path.join(outputPath, 'schema');
    // tslint:disable-next-line: no-console
    console.log("Writing client to: ", outputPath);
    await fs.writeFile(path.join(schemaOutputPath, 'index.js'), schemaSrc, { encoding: "utf-8" });
    await fs.writeFile(path.join(schemaOutputPath, 'index.d.ts'), schemaSrcTypes, { encoding: "utf-8" });
    // tslint:disable-next-line: no-console
    console.log("Client Generated.");
  } else {
    // tslint:disable-next-line: no-console
    console.error("Something went wrong. No output path or source generated...");
  }
}