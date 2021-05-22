"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const utils_1 = require("../utils");
const componentSchema_1 = require("./componentSchema");
const generate = (data) => `
const componentSchemas = {
${utils_1.reduce(Object.values(data.components), (component) => `
  ${component.component}: ${componentSchema_1.generateComponentSchema(component)},
`)}
}
`;
exports.generate = generate;
//# sourceMappingURL=schema.js.map