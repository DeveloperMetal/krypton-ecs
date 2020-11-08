import { Identifiable } from './utils';

export type FieldTypeof = 'number' | 'string' | 'bigint' | 'boolean';
export type FieldType = string | number | bigint | boolean;

export type FieldDefinition = {
  defaultValue?: FieldType;
  type: FieldTypeof;
  nullable?: boolean;
};

export type ComponentFields<T extends ComponentInterface> = {
  [field in keyof T]: FieldDefinition;
};

export interface IComponent {
  $id: string;
  keys(): string[];
}

export interface ComponentInterface {
  [index: string]: FieldType | null;
}

export class Component<T extends ComponentInterface> extends Identifiable implements IComponent {
  private _fieldDef: ComponentFields<T>;

  constructor(id: string, fieldDef: ComponentFields<T>) {
    super();
    this._fieldDef = fieldDef;
    this.$id = id;

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

          return Reflect.set(obj, key, value);
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

    return prox;
  }

  keys() {
    return Object.keys(this._fieldDef);
  }

  as<A extends ComponentInterface>() {
    return (this as unknown) as A & IComponent;
  }
}
