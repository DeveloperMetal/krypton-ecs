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
const yaml_1 = require("../parsers/yaml");
const findup_sync_1 = __importDefault(require("findup-sync"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const interfaces_1 = require("./generators/interfaces");
const schema_1 = require("./generators/schema");
function installPackages(packages) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const packagesToInstall = [];
            for (const dep of packages) {
                try {
                    require(dep.name);
                }
                catch (err) {
                    console.log("Module not found: ", dep.name);
                    packagesToInstall.push(dep.url);
                }
            }
            if (packagesToInstall.length === 0) {
                return resolve();
            }
            let cmd = `npm i -s ${packagesToInstall.join(' ')}`;
            if (yield usesYarn()) {
                cmd = `yarn add ${packagesToInstall.join(' ')}`;
            }
            child_process_1.exec(cmd, (error, stdout, stderr) => {
                if (error) {
                    console.log(stdout);
                    console.log(stderr);
                    reject(error);
                    return;
                }
                console.log(stdout);
                resolve();
            });
        }));
    });
}
function usesYarn(cwd = process.cwd()) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const stat = yield promises_1.default.stat(path_1.default.resolve(cwd, 'yarn.lock'));
            return stat.isFile();
        }
        catch (err) {
            return false;
        }
    });
}
function generateCode(data) {
    const src = `// Component and Entity Schema ////////////////////////////////////////////////
${schema_1.generate(data)}

module.exports = {
  schema: componentSchemas
}
`;
    return src;
}
function generateTypes(data) {
    const src = `import { IECSSchema, IComponentDefinition } from '@kryptonstudio/ecs';

// Component Interfaces //////////////////////////////////////////////////////
${interfaces_1.generate(data)}

export declare const schema: IECSSchema;
`;
    return src;
}
function default_1(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {
            components: [],
            entities: []
        };
        try {
            console.log("-- Loading: ", argv.i);
            yield yaml_1.parseYaml(argv.i, data);
        }
        catch (err) {
            console.log("-- Error parsing yaml ---------------");
            console.error(err);
            return;
        }
        const src = generateCode(data);
        const types = generateTypes(data);
        const packageJsonPath = findup_sync_1.default("package.json");
        if (!packageJsonPath) {
            throw Error("Could not determine project root directory.");
        }
        let outputPath = path_1.default.resolve(path_1.default.join(path_1.default.dirname(packageJsonPath), '.kecs'));
        yield promises_1.default.mkdir(outputPath, {
            recursive: true
        });
        if (argv.o) {
            try {
                yield promises_1.default.stat(argv.o);
                outputPath = argv.o;
            }
            catch (ex) {
                console.log(ex);
                yield promises_1.default.mkdir(argv.o, { recursive: true });
            }
        }
        if (src && outputPath) {
            console.log("Writing client to: ", outputPath);
            yield promises_1.default.writeFile(path_1.default.join(outputPath, 'index.js'), src, { encoding: "utf-8" });
            yield promises_1.default.writeFile(path_1.default.join(outputPath, 'index.d.ts'), types, { encoding: "utf-8" });
            installPackages([]);
            console.log("Client Generated.");
        }
        else {
            console.error("Something went wrong. No output path or source generated...");
        }
    });
}
exports.default = default_1;
//# sourceMappingURL=index.js.map