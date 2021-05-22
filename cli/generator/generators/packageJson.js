"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = void 0;
const generate = () => {
    const packageJson = {
        name: ".kryptonstudio-ecs-client",
        version: "1.0.0",
        license: "MIT"
    };
    return JSON.stringify(packageJson, undefined, 2);
};
exports.generate = generate;
//# sourceMappingURL=packageJson.js.map