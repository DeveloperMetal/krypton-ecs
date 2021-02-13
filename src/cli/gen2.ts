import {Plop, run} from "plop";
import minimist from "minimist";
import path from "path";

const args = process.argv.slice(2);
const argv = minimist(args);

export default function() {
  Plop.launch({
    cwd: argv.cwd,
    configPath: path.resolve(path.join(__dirname, '..', 'plopfile.js')),
    require: argv.require,
    completion: argv.completion
  }, env => run(env, undefined, true));
}