import { ECS } from '.';
import { Entity } from './entity';

export type ECSDefine = {
  components: ECSComponentsDefine;
};

export type ECSComponentsDefine = {
  [component: string]: ComponentInterface;
};

export type ECSComponentDefineTypes<E extends ECSDefine> = {
  [K in keyof E['components']]: ComponentFields<E['components'][K]>;
};

export enum FilterType {
  Adding = 1,
  Added = 2,
  Removing = 4,
  Removed = 8,
  Modifying = 16,
  Modified = 32,
}

export type FilterCallback<C extends ECSDefine> = (ecs: ECS<C>, entities: Entity<C>[]) => Entity<C>[];
export type System<C extends ECSDefine> = (ecs: ECS<C>, entities: Entity<C>[]) => Promise<void> | void;

export type ComponentDefinitions = {
  [name: string]: ComponentFields<ComponentInterface>;
};

export type FilterToSystemMap<C extends ECSDefine> = Map<FilterCallback<C>, Set<System<C>>>;

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

export interface IComponent<C extends ECSDefine> {
  $id: string;
  parentEntity: Entity<C>;
  keys(): string[];
}

export interface ComponentInterface {
  [index: string]: FieldType | null;
}

export type ComponentConstructor<T extends ComponentInterface, C extends ECSDefine> = new (
  id: string,
  fieldDef: ComponentFields<T>,
) => IComponent<C>;
