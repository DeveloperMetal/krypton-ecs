import { IECSSchema } from "../../../schema/types";
import { reduce } from "../utils";

export const generate = (data: IECSSchema) => reduce(data.components, (component) => `
/**
 * Component: ${component.component}
 **/
export interface ${component.component} extends IComponent {
${reduce(Object.keys(component.fields), (fieldName) => `
  ${fieldName}: ${component.fields[fieldName].type}`)}
}`);
