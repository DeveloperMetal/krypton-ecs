import { Identifiable } from '../utils';
import { Entity } from '../entity';
import { IComponent, IComponentAPI, ComponentFields, FieldDefinition, SystemEvent, ECSDefine, FieldTypeOf } from '../types';
import { InternalECS } from '../internal';

export class Component<C extends ECSDefine> extends Identifiable<C> implements IComponentAPI<C> {
  private _fieldDef: ComponentFields<IComponent>;
  private _parent: Entity<C>;
  private _modifiedFields: Set<string | number | symbol> = new Set<string | number | symbol>();

  constructor(id: string, parent: Entity<C>, ecs: InternalECS<C>) {
    super(id, ecs);
    const fieldDef = ecs.components.get(id);
    if (fieldDef) {
      this._fieldDef = fieldDef;
    } else {
      throw Error(`Component definition missing for ${id}`);
    }
    this._parent = parent;
    let inConstructor = true;

    const me = this;
    // Build a proxy to guard component fields agaisnt invalid value types
    const prox = new Proxy(this, {
      set(obj, key, value) {
        if (key in obj._fieldDef) {
          const def = Reflect.get(obj._fieldDef, key) as FieldDefinition<unknown>;
          if (!def.nullable && value === null) {
            throw new TypeError('Invalid Type. Field is not nullable');
          }


          if (!def.nullable) {
            const typeOf = typeof value;
            if (typeOf === "string" && def.typeof != FieldTypeOf.string ) {
              throw new TypeError(`Value is not a string`);
            } else if (typeOf === "number" && def.typeof != FieldTypeOf.number) {
              throw new TypeError('Value is not a number');
            } else if (typeOf === "boolean" && def.typeof != FieldTypeOf.boolean) {
              throw new TypeError('Value is not a boolean');
            } else if (typeOf === "object") {
              if ( value.constructor !== Float32Array && def.typeof == FieldTypeOf.float32Array) {
                throw new TypeError('Value is not a Float32Array');
              }
            }
          }

          const result = Reflect.set(obj, key, value);
          if (result && !inConstructor) {
            me._modifiedFields.add(key);
            me.$ecs.enqueueTrigger(SystemEvent.Modifying, me._parent);
          }

          return result;
        }

        throw new TypeError(`Field ${String(key)} not found`);
      },
    });

    // Prime fields with default values
    for (const key of Object.keys(this._fieldDef)) {
      if (this._fieldDef[key].defaultValue !== undefined) {
        Reflect.set(prox, key, this._fieldDef[key].defaultValue);
      } else if (this._fieldDef[key].nullable) {
        Reflect.set(prox, key, null);
      } else {
        throw new TypeError('Default Value is required when field is not nullable');
      }
    }
    inConstructor = false;

    return prox;
  }

  get parentEntity() {
    return this._parent;
  }

  keys() {
    return Object.keys(this._fieldDef);
  }

  as<K extends keyof C>(): C[K] & IComponentAPI<C> {
    return (this as unknown) as C[K] & IComponentAPI<C>;
  }

  modifiedFields(): (string | number | symbol)[] {
    return Array.from(this._modifiedFields.values());
  }

  resetModifiedFields() {
    this._modifiedFields.clear();
  }
}
