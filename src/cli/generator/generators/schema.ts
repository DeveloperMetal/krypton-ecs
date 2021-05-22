import { IECSSchema } from "@/ecs/schemas";
import { reduce } from "../utils";
import { generateComponentSchema } from './componentSchema';

export const generate = (data: IECSSchema<string>) => `
const componentSchemas = {
${reduce(Object.values(data.components), (component) => `
  ${component.component}: ${generateComponentSchema(component)},
`)}
}
`;
