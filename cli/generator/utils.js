"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reduce = void 0;
const reduce = (arr, fn) => {
    return arr.reduce((p, c) => `${p}${fn(c)}`, '');
};
exports.reduce = reduce;
//# sourceMappingURL=utils.js.map