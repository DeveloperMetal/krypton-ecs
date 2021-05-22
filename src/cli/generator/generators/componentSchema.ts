import { IComponentSchema } from "@kryptonstudio/ecs";
import { reduce } from "../utils";

export const generateComponentSchema = (component: IComponentSchema) => `{
    component: "${component.component}",
    fields: {${reduce(Object.entries(component.fields || {}), ([fieldName, field]) => `
      ${fieldName}: {
        typeof: "${field.type}",${field.defaultValue?`
        defaultValue: ${JSON.stringify(field.defaultValue)},`:''
        }${field.allowNull?`
        allowNull: true`:''}
      },`)}
    }
  }`
