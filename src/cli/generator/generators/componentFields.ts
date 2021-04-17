import { IECSSchema } from "../../../schema/types";
import { reduce } from "../utils";

export const generate = (data: IECSSchema) => reduce(data.components, (component) => `
const ${component.component}Fields: ComponentFields<${component.component}> = {
${reduce(Object.keys(component.fields), (fieldName) => `
  ${fieldName}: {
    typeof: FieldTypeOf.${component.fields[fieldName].type},
    defaultValue: FieldTypeOf.${component.fields[fieldName].defaultValue},
    allowNull: FieldTypeOf.${component.fields[fieldName].allowNull}
  },`)}
}`);
