import { IECSSchema } from "@/ecs/schemas";
import { IGeneratorInfo } from "../types";
import { reduce } from "../utils";
import { generateComponentSchema } from './componentSchema';

export const generate = (data: IECSSchema<string>): IGeneratorInfo => {
  return {
    exports: [
      {
        exportName: "schema",
        localName: "componentSchemas"
      }
    ],
    src:`
// Component and Entity Schema ////////////////////////////////////////////////
const componentSchemas = {
${reduce(Object.values(data.components), (component) => `
  ${component.component}: ${generateComponentSchema(component)},
`)}
}
`
  }
};
