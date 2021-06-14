import { reduce } from "../utils";
export const generate = (data) => {
    return {
        src: `
  ${reduce(Object.values(data.components), (component) => `
  export interface I${component.component} {
    ${component.component}: {${reduce(Object.entries(component.fields || {}), ([fieldName, field]) => `
      ${fieldName}: ${field.type}${field.allowNull ? ' | null' : ''}`)}
    }
  }`)}

  export interface IClientComponents extends IComponentDefinition {${reduce(Object.values(data.components), (component) => `
      ${component.component}: I${component.component}`)}
  }

  export type IClientComponentNames = ${Object.values(data.components).reduce((p, component) => p.concat(`"${component.component}"`), []).join(' | ')};
  `
    };
};
//# sourceMappingURL=interfaces.js.map