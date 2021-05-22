"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const utils_1 = require("../utils");
const generate = (data) => `
${utils_1.reduce(Object.values(data.components), (component) => `
export interface I${component.component} {
  ${component.component}: {${utils_1.reduce(Object.entries(component.fields || {}), ([fieldName, field]) => `
    ${fieldName}: ${field.type}${field.allowNull ? ' | null' : ''}`)}
  }
}`)}

export interface IClientComponents extends IComponentDefinition {${utils_1.reduce(Object.values(data.components), (component) => `
    ${component.component}: I${component.component}`)}
}

export type IClientComponentNames = ${Object.values(data.components).reduce((p, component) => p.concat(`"${component.component}"`), []).join(' | ')};
`;
exports.generate = generate;
//# sourceMappingURL=interfaces.js.map