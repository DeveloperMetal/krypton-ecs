import yargs from "yargs";
import generatorHandler from './generator';

yargs
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
    // tslint:disable-next-line: no-shadowed-variable
    handler: generatorHandler
  })
  .help()
  .showHelpOnFail(true)
  .parse();