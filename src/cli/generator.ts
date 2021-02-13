import { parseYaml } from "./parsers/yaml";
import { IECSSchema } from "../schema/types";
import { IGeneratorArgs } from "./types";

function generateCode(data: IECSSchema) {
  const src = [];
  src.push(`import { IComponent, IEntity, FieldTypeOf } from "@kryptonstudio/ecs"`);
  src.push('');
  for(const component of data.components) {
    src.push(`/**`);
    src.push(` * Component: ${component.component}`);
    src.push(` */`)
    src.push(`export interface ${component.component} extends IComponent {`);
    for(const fieldName of Object.keys(component.fields)) {
      const field = component.fields[fieldName];
      src.push(`  ${fieldName}: ${field.type}`);
    }
    src.push(`}`)
    src.push('');
    src.push(`const ${component.component}Fields: ComponentFields<${component.component}> = {`);
    for(const fieldName of Object.keys(component.fields)) {
      const field = component.fields[fieldName];
      src.push(`  ${fieldName}: {`);
      src.push(`    typeof: FieldTypeOf.${field.type},`);
      src.push(`    defaultValue: ${field.defaultValue},`);
      src.push(`    allowNull: ${!!field.allowNull}`);
      src.push('  }');
    }
    src.push('');

  }

  src.push(`interface ECSCore extends ECSDefine {`);
  for(const component of data.components) {
    src.push(`  ${component.component}: ${component.component},`);
  }
  src.push('}')


  for(const entity of (data.entities || [])) {
    src.push('/**');
    src.push(' * Initializes all entities')
    src.push(' */')
    src.push(`default function(ecs: ECS<IDefine>) {`);
    if ( entity.components.length > 0 ) {
      src.push(`  ecs.entity("${entity.entity}", "${entity.components.join('","')}")`)
    } else {
      src.push(`  ecs.entity("${entity.entity}")`)
    }
    src.push(`}`)
    src.push('');
  }

  // tslint:disable-next-line: no-console
  console.log(src.join("\n"));
}

export default async function (argv: IGeneratorArgs) {
  const data: IECSSchema = {
    components: [],
    entities: []
  };
  await parseYaml(argv.i, data);
  // tslint:disable-next-line: no-console
  console.log(data);
  generateCode(data);
}