var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { parseYaml } from "../parsers/yaml";
import findup from "findup-sync";
import fs from "fs/promises";
import path from "path";
import { JSGenerator, TSTypesGenerator } from "./utils";
import { generate as generateInterfaces } from "./generators/interfaces";
import { generate as generateSchema } from "./generators/schema";
import { generate as generateClient } from "./generators/client";
import { generate as generateClientTypes } from "./generators/clientTypes";
function generateCode(data) {
    const js = new JSGenerator();
    js.collect(generateSchema(data));
    js.collect(generateClient(data));
    return js.generateSrc();
}
function generateTypes(data) {
    const ts = new TSTypesGenerator();
    ts.collect(generateInterfaces(data));
    ts.collect(generateClientTypes(data));
    return ts.generateSrc();
}
export default function (argv) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {
            components: [],
            entities: []
        };
        try {
            console.log("-- Loading: ", argv.i);
            yield parseYaml(argv.i, data);
        }
        catch (err) {
            console.log("-- Error parsing yaml ---------------");
            console.error(err);
            return;
        }
        const schemaSrc = generateCode(data);
        const schemaSrcTypes = generateTypes(data);
        const packageJsonPath = findup("package.json");
        if (!packageJsonPath) {
            throw Error("Could not determine project root directory.");
        }
        let outputPath = path.resolve(path.join(path.dirname(packageJsonPath), '.kecs'));
        yield fs.mkdir(outputPath, {
            recursive: true
        });
        if (argv.o) {
            try {
                yield fs.stat(argv.o);
                outputPath = argv.o;
            }
            catch (ex) {
                console.log(ex);
                yield fs.mkdir(argv.o, { recursive: true });
            }
        }
        if (schemaSrc && outputPath) {
            const schemaOutputPath = path.join(outputPath, 'schema');
            console.log("Writing client to: ", outputPath);
            yield fs.writeFile(path.join(schemaOutputPath, 'index.js'), schemaSrc, { encoding: "utf-8" });
            yield fs.writeFile(path.join(schemaOutputPath, 'index.d.ts'), schemaSrcTypes, { encoding: "utf-8" });
            console.log("Client Generated.");
        }
        else {
            console.error("Something went wrong. No output path or source generated...");
        }
    });
}
//# sourceMappingURL=index.js.map