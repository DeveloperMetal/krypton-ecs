import { Entity } from "..";
import { IComponentSchema, IFieldSchema } from "../schemas/types";
import { Identifiable } from "./utils";

export class Component extends Identifiable {

  constructor(public readonly _schema: IComponentSchema, private _parent: Entity, useTypeGuards: boolean = true) {
    super(_schema.component);
    let inConstructor = true;

    // Build a proxy to guard component fields agaisnt invalid value types
    const prox = new Proxy(this, {
      set(obj, key, value) {

        if ( Reflect.has(_schema.fields, key) ) {
          if ( !inConstructor && useTypeGuards ) {
            const fieldSchema = Reflect.get(_schema.fields, key) as IFieldSchema;
            if (!fieldSchema.allowNull && value === null) {
              throw new TypeError('Invalid Type. Field is not nullable');
            }

            if (!fieldSchema.allowNull) {
              const typeOf = typeof value;
              if (typeOf === 'string' && fieldSchema.type !== "string") {
                throw new TypeError(`Value is not a string`);
              } else if (typeOf === 'number' && fieldSchema.type !== "number") {
                throw new TypeError('Value is not a number');
              } else if (typeOf === 'boolean' && fieldSchema.type !== "boolean") {
                throw new TypeError('Value is not a boolean');
              } else if (typeOf === 'object') {
                if (value.constructor === Float32Array && fieldSchema.type !== "float32Array") {
                  throw new TypeError('Value is not a Float32Array');
                }
              }
            }
          }

          const result = Reflect.set(obj, key, value);

          return result;
        } else {
          throw new TypeError(`Component Field ${String(key)} not found`);
        }

      },
    });

    // prime component fields
    for(const [fieldName, fieldSchema] of Object.entries(_schema.fields)) {

      // Prime default values
      if (fieldSchema.defaultValue !== null) {
        if ( fieldSchema.type === "string") {
          if ( typeof fieldSchema.defaultValue !== "string" ) {
            throw new TypeError(`Default value for field "${fieldName}" must be of type ${fieldSchema.type}`);
          }
          Reflect.set(prox, fieldName, ""+fieldSchema.defaultValue);
        } else if ( fieldSchema.type === "boolean" ) {
          if (typeof fieldSchema.defaultValue !== "boolean") {
            throw new TypeError(`Default value for field "${fieldName}" must be of type ${fieldSchema.type}`);
          }
          Reflect.set(prox, fieldName, !!fieldSchema.defaultValue);
        } else if ( fieldSchema.type === "number" ) {
          if (typeof fieldSchema.defaultValue !== "number") {
            throw new TypeError(`Default value for field "${fieldName}" must be of type ${fieldSchema.type}`);
          }
          Reflect.set(prox, fieldName, fieldSchema.defaultValue);
        } else if ( fieldSchema.type === "float32Array" ) {
          if ( fieldSchema.defaultValue && fieldSchema.defaultValue.constructor === Float32Array ) {
            Reflect.set(prox, fieldName, fieldSchema.defaultValue);
          } else if ( fieldSchema.defaultValue && fieldSchema.defaultValue.constructor === Array ) {
            Reflect.set(prox, fieldName, Float32Array.from(fieldSchema.defaultValue));
          } else {
            throw new TypeError(`Default value for field "${fieldName}" must be of type ${fieldSchema.type}`);
          }
        } else {
          if (typeof fieldSchema.defaultValue !== "object") {
            throw new TypeError(`Default value for field "${fieldName}" must be of type ${fieldSchema.type}`);
          }
          Reflect.set(prox, fieldName, fieldSchema.defaultValue);
        }
      } else if (fieldSchema.allowNull) {
        Reflect.set(prox, fieldName, null);
      } else {
        throw new TypeError('Default Value is required when field is not nullable');
      }
    }

    inConstructor = false;

    return prox;
  }

  get parentEntity(): Entity {
    return this._parent;
  }

  as<T>() {
    return this as unknown as Component & T;
  }
}