var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from "path";
import glob from "glob";
import yaml from "js-yaml";
import fs from "fs/promises";
function globPath(pattern) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Promise((resolve, reject) => {
            glob(pattern, (err, matches) => {
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
            const searchPath = path.join(search, pattern);
            const matches = yield globPath(searchPath);
            results.push(...matches);
        }
        return results;
    });
}
export function parseYaml(yamlPath, data, depth = 0, openCache = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const prefix = "  ".repeat(depth);
        const input = yaml.load(yield fs.readFile(yamlPath, 'utf8'));
        const inputPathDir = path.resolve(path.dirname(yamlPath));
        const searchPaths = [inputPathDir];
        if ("include" in input) {
            for (const include of input.include) {
                if (typeof include === "string") {
                    const results = yield globSearch(searchPaths, include);
                    for (const result of results) {
                        if (result !== yamlPath) {
                            const resultYamlPath = result.endsWith('.yml') ? result : path.join(result, 'index.yml');
                            try {
                                yield fs.stat(resultYamlPath);
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
//# sourceMappingURL=yaml.js.map