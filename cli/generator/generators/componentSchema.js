"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateComponentSchema = void 0;
const utils_1 = require("../utils");
const generateComponentSchema = (component) => `{
    component: "${component.component}",
    fields: {${utils_1.reduce(Object.entries(component.fields || {}), ([fieldName, field]) => `
      ${fieldName}: {
        typeof: "${field.type}",${field.defaultValue ? `
        defaultValue: ${JSON.stringify(field.defaultValue)},` : ''}${field.allowNull ? `
        allowNull: true` : ''}
      },`)}
    }
  }`;
exports.generateComponentSchema = generateComponentSchema;
//# sourceMappingURL=componentSchema.js.map