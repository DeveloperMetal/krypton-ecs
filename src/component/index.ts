import { Identifiable } from '../utils';
import { Entity } from '../entity';
import { ComponentInterface, IComponent, ComponentFields, FieldDefinition, SystemEvent, ECSDefine } from '../types';
import { InternalECS } from '../internal';

export class Component extends Identifiable implements IComponent {
  private _fieldDef: ComponentFields<ComponentInterface>;
  private _parent: Entity;

  constructor(id: string, parent: Entity, ecs: InternalECS) {
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
          const def = Reflect.get(obj._fieldDef, key) as FieldDefinition;
          if (!def.nullable && value === null) {
            throw new TypeError('Invalid Type. Field is not nullable');
          }

          if (!def.nullable && typeof value !== def.type) {
            throw new TypeError('Invalid Type');
          }

          const result = Reflect.set(obj, key, value);
          if (result && !inConstructor) {
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

  as<C extends ECSDefine, K extends keyof C['components']>() {
    return (this as unknown) as C['components'][K] & IComponent;
  }
}
