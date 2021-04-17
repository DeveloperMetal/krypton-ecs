import { IECSSchema } from "../../../schema/types";
import { reduce } from "../utils";

export const generate = (data: IECSSchema) => `
export interface ECSCore extends ECSDefine {
${reduce(data.components, (component) => `
  ${component.component}: ${component.component}
`)}
}
`;
