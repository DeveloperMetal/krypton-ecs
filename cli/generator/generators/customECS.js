"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const generate = (_data) => `
/**
 * ECS Client
 **/
export interface ECSClient extends ECSBase<IComponents> {
  constructor(opts) {
    super(schema, opts);
  }
}`;
exports.generate = generate;
//# sourceMappingURL=customECS.js.map