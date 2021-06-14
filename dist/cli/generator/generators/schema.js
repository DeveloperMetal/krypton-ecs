import { reduce } from "../utils";
import { generateComponentSchema } from './componentSchema';
export const generate = (data) => {
    return {
        exports: [
            {
                exportName: "schema",
                localName: "componentSchemas"
            }
        ],
        src: `
// Component and Entity Schema ////////////////////////////////////////////////
const componentSchemas = {
${reduce(Object.values(data.components), (component) => `
  ${component.component}: ${generateComponentSchema(component)},
`)}
}
`
    };
};
//# sourceMappingURL=schema.js.map