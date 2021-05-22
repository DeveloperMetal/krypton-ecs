"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const generator_1 = __importDefault(require("./generator"));
const projectInit_1 = __importDefault(require("./projectInit"));
yargs_1.default
    .command({
    command: "init",
    describe: "Bootstraps a kecs project",
    builder: {
        name: {
            string: true,
            demandOption: true
        }
    },
    handler: projectInit_1.default
})
    .command({
    command: "generate",
    describe: "Generates ecs typed client",
    builder: {
        in: {
            alias: "i",
            string: true,
            demandOption: true
        },
        out: {
            alias: "o",
            string: true,
            demandOption: false
        }
    },
    handler: generator_1.default
})
    .help()
    .showHelpOnFail(true)
    .parse();
//# sourceMappingURL=index.js.map