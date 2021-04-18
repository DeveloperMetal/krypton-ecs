const fs = require("fs/promises");
const path = require("path");
const utils = require("util");
const { spawn } = require("child_process");
const package = require('./package.json');
const os = require("os");
const isWindows = os.platform() == "win32";
const cliProgress = require('cli-progress');
const _colors = require('colors');

async function exec(cmd, opts) {
  return new Promise(async (resolve, reject) => {
    const p = spawn(cmd, opts, { stdout: 'inherit', stdio: 'inherit', stdout: 'inherit' });

    p.on('error', (err) => {
      console.log(err);
    });

    p.on('exit', (code) => {
      resolve(code);
    });
  });
}

function progressFormatter(options, params, payload) {
  const bar = options.barCompleteString.substr(0, Math.round(params.progress * options.barsize));
  const barAfter = " ".repeat(options.barsize - (Math.round(params.progress * options.barsize)));
  return `[${bar + barAfter}] ` + payload.label + ' | ' + _colors.yellow(params.value + '/' + params.total) + ' | ETA: ' + params.eta + 's';
}

async function step(progress, cb, label, failMsg, step) {

  progress.update(step, { label });
  const result = await cb();

  if ( !result ) {
    progress.update(step, { label: _colors.red(failMsg) });
    process.exit(1);
  }  else {
    progress.update(step, { label: _colors.green("Success!") });
  }
}

const libPackageConfig = () => ({
  "name": package.name,
  "version": package.version,
  "main": "./index.js",
  "types": "./index.d.ts",
  "repository": package.repository,
  "dependencies": package.dependencies
})

async function lint() {
  const suffix = isWindows ?".cmd":""
  const lint = path.join(".", "node_modules", ".bin", `tslint${suffix}`);
  // lint source
  return await exec(lint, ['-p', 'tsconfig.json']) === 0;
}

async function compile() {
  const suffix = isWindows ? ".cmd" : ""
  const tsc = path.join(".", "node_modules", ".bin", `tsc${suffix}`);
  // build distributable
  return await exec(tsc, ['-p', 'tsconfig.json']) === 0;
}

async function genPackageJson(outputPath) {
  // generate package.json
  try {
    await fs.writeFile(path.join(outputPath, 'package.json'), JSON.stringify(libPackageConfig(), undefined, 2));
    return true;
  } catch(e) {
    console.error(e);
    return false;
  }
}

async function copyFiles(outputPath) {
  // Copy readme
  try {
    await fs.copyFile(path.join(".", "README.md"), path.join(outputPath, "README.md"));
    await fs.copyFile(path.join(".", "LICENSE"), path.join(outputPath, "LICENSE"));
    return true;
  } catch(e) {
    return false;
  }
}

async function build() {
  const outputDir = path.resolve(path.join('.', 'dist'));
  const progress = new cliProgress.SingleBar({
    format: progressFormatter
  }, cliProgress.Presets.shades_classic);
  progress.start(5, 0);

  await step(progress, lint, "Run Linter", "Linter Failed", 1);
  await step(progress, compile, "Compile", "Failed Compilation", 2);
  await step(progress, async () => await genPackageJson(outputDir), "Generate package.json", "Failed generating package.json", 3);
  await step(progress, async () => await copyFiles(outputDir), "Copying util files", "Failed copying files", 4);

  progress.update(5, { label: _colors.green("Build Complete!") })
  progress.stop();
}

build();