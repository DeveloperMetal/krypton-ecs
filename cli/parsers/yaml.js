"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYaml = void 0;
const path_1 = __importDefault(require("path"));
const glob_1 = __importDefault(require("glob"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const promises_1 = __importDefault(require("fs/promises"));
function globPath(pattern) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => {
            glob_1.default(pattern, (err, matches) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(matches);
                }
            });
        });
    });
}
function globSearch(searchPaths, pattern) {
    return __awaiter(this, void 0, void 0, function* () {
        const results = [];
        for (const search of searchPaths) {
            const searchPath = path_1.default.join(search, pattern);
            const matches = yield globPath(searchPath);
            results.push(...matches);
        }
        return results;
    });
}
function parseYaml(yamlPath, data, depth = 0, openCache = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const prefix = "  ".repeat(depth);
        const input = js_yaml_1.default.load(yield promises_1.default.readFile(yamlPath, 'utf8'));
        const inputPathDir = path_1.default.resolve(path_1.default.dirname(yamlPath));
        const searchPaths = [inputPathDir];
        if ("include" in input) {
            for (const include of input.include) {
                if (typeof include === "string") {
                    const results = yield globSearch(searchPaths, include);
                    for (const result of results) {
                        if (result != yamlPath) {
                            const resultYamlPath = result.endsWith('.yml') ? result : path_1.default.join(result, 'index.yml');
                            try {
                                yield promises_1.default.stat(resultYamlPath);
                            }
                            catch (e) {
                                return;
                            }
                            if (Reflect.has(openCache, resultYamlPath)) {
                                return;
                            }
                            else {
                                openCache[resultYamlPath] = true;
                                yield parseYaml(resultYamlPath, data, depth + 1, openCache);
                            }
                        }
                    }
                }
                else {
                    try {
                        const modulePath = require.resolve(include.module);
                        if (modulePath) {
                            const results = yield globSearch([modulePath], include.import);
                            if (results.length === 0) {
                                console.error(prefix + `[ERROR] Missing module import file: ${include.module}/${include.import}`);
                            }
                        }
                    }
                    catch (e) {
                        console.error(prefix + `[ERROR] Missing module: ${include.module}`);
                        throw e;
                    }
                }
            }
        }
        else if ("component" in input && typeof input.component === "string") {
            data.components.push(input);
        }
        else if ("entity" in input && typeof input.entity === "string") {
            if (data.entities) {
                data.entities.push(input);
            }
        }
        else if (input.constructor === Array) {
            if ("component" in input[0]) {
                for (const component of input) {
                    data.components.push(component);
                }
            }
            else if ("entity" in input[0]) {
                if (data.entities) {
                    for (const entity of input) {
                        data.entities.push(entity);
                    }
                }
            }
        }
    });
}
exports.parseYaml = parseYaml;
//# sourceMappingURL=yaml.js.map