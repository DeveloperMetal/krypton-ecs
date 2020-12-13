import { Identifiable } from '../utils';
import { Entity } from '../entity';
import { ComponentInterface, IComponent, ComponentFields, ECSDefine, FieldDefinition, FilterType } from '../types';
import { InternalECS } from '../internal';

export class Component<T extends ComponentInterface, C extends ECSDefine>
  extends Identifiable<C>
  implements IComponent<C> {
  private _fieldDef: ComponentFields<T>;
  private _parent: Entity<C>;

  constructor(id: string, fieldDef: ComponentFields<T>, parent: Entity<C>, ecs: InternalECS<C>) {
    super(id, ecs);
    this._fieldDef = fieldDef;
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
            me.$ecs.enqueueTrigger(FilterType.Modifying, me._parent);
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

  as<A extends ComponentInterface>() {
    return (this as unknown) as A & IComponent<C>;
  }
}
