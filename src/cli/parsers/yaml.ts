import path from "path";
import glob from "glob";
import yaml from "js-yaml";
import fs from "fs/promises";
import { IECSSchema, GeneratorInput, IComponentSchema, IEntitySchema } from "../schema/types";

async function globPath(pattern: string): Promise<string[]> {
  return await new Promise((resolve, reject) => {
    glob(pattern, (err, matches) => {
      if (err) {
        reject(err);
      } else {
        resolve(matches);
      }
    })
  })
}

async function globSearch(searchPaths: string[], pattern: string): Promise<string[]> {
  const results = [];
  for (const search of searchPaths) {
    const searchPath = path.join(search, pattern);
    const matches = await globPath(searchPath);
    // tslint:disable-next-line: no-console
    results.push(...matches);
  }

  return results;
}

export async function parseYaml(yamlPath: string, data: IECSSchema, depth=0, openCache: { [name: string]: boolean }={}) {
  const prefix = "  ".repeat(depth);
  const input = yaml.load(await fs.readFile(yamlPath, 'utf8')) as GeneratorInput;
  const inputPathDir = path.resolve(path.dirname(yamlPath));
  const searchPaths = [inputPathDir]

  // load includes
  if ( "include" in input) {
    for (const include of input.include) {
      if (typeof include === "string") {
        const results = await globSearch(searchPaths, include);
        for(const result of results) {
          if ( result != yamlPath ) {
            const resultYamlPath = result.endsWith('.yml') ? result : path.join(result, 'index.yml');

            try {
              await fs.stat(resultYamlPath);
            } catch (e) {
              return;
            }

            if ( Reflect.has(openCache, resultYamlPath) ) {
              // File already parsed, skip
              return;
            } else {
              openCache[resultYamlPath] = true;
              await parseYaml(resultYamlPath, data, depth + 1, openCache);
            }
          }
        }
      } else {
        try {
          const modulePath = require.resolve(include.module);
          if (modulePath) {
            const results = await globSearch([modulePath], include.import);
            if ( results.length === 0 ) {
              // tslint:disable-next-line: no-console
              console.error(prefix + `[ERROR] Missing module import file: ${include.module}/${include.import}`);
            }
          }
        } catch(e) {
          // tslint:disable-next-line: no-console
          console.error(prefix + `[ERROR] Missing module: ${include.module}`);
          throw e;
        }
      }
    }
  } else if ( "component" in input && typeof input.component === "string" ) {
    data.components.push(input)
  } else if ( "entity" in input && typeof input.entity === "string" ) {
    if ( data.entities ) {
      data.entities.push(input);
    }
  } else if ( input.constructor === Array ) {
    if ( "component" in input[0] ) {
      for(const component of input as IComponentSchema[] ) {
        data.components.push(component);
      }
    } else if ( "entity" in input[0] ) {
      if ( data.entities ) {
        for(const entity of input as IEntitySchema[] ) {
          data.entities.push(entity);
        }
      }
    }
  }

}