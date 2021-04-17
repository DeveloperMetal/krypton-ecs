import { IECSSchema } from "../../schema/types";
import { parseYaml } from "../parsers/yaml";
import { IGeneratorArgs } from "../types";
import findup from "findup-sync";
import fs from "fs/promises";
import path from "path";
import { generate as generateInterfaces } from "./generators/interfaces";
import { generate as generateFields } from "./generators/componentFields";
import { generate as generateDefine } from "./generators/ecsDefine";
import { generate as generateEntities } from "./generators/entities";

function generateCode(data: IECSSchema) {
  const src = `
import {
  IDefine,
  IComponent,
  IEntity,
  FieldTypeOf,
  ComponentFields,
  ECSDefine,
  ECS } from "@kryptonstudio/ecs";

// Interfaces /////////////////////////////////////////////////////////////////
${generateInterfaces(data)}

// Fields /////////////////////////////////////////////////////////////////////
${generateFields(data)}

// ECSDefine //////////////////////////////////////////////////////////////////
${generateDefine(data)}

// Entities ///////////////////////////////////////////////////////////////////
${generateEntities(data)}
`;

  return src;
}

export default async function (argv: IGeneratorArgs) {
  const data: IECSSchema = {
    components: [],
    entities: []
  };

  try {
    await parseYaml(argv.i, data);
  } catch(err) {
    console.log("-- Error parsing yaml ---------------")
    console.error(err);
    return;
  }
  // tslint:disable-next-line: no-console
  console.log("-- Generating ------------------------")
  console.log(data);
  const src = generateCode(data);
  const node_modules_path = findup("node_modules");
  let output_path = "";

  if ( node_modules_path ) {
    output_path = path.join(node_modules_path, "@kryptonstudio", "ECSClient");
    await fs.mkdir(output_path, {
      recursive: true
    });
  }

  if ( argv.o ) {
    try {
      await fs.stat(argv.o);
      output_path = argv.o;
    } catch(ex) {
      console.log(ex);
      await fs.mkdir(argv.o, { recursive: true });
    }

    console.log(src);

    fs.writeFile(path.join(output_path, 'index.ts'), src, {encoding: "utf-8"})
  }
}