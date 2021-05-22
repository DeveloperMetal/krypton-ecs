import yargs from "yargs";
import generatorHandler from './generator';
import projectInitHandler from './projectInit';

yargs
  .command({
    command: "init",
    describe: "Bootstraps a kecs project",
    builder: {
      name: {
        string: true,
        demandOption: true
      }
    },
    handler: projectInitHandler
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
    // tslint:disable-next-line: no-shadowed-variable
    handler: generatorHandler
  })
  .help()
  .showHelpOnFail(true)
  .parse();