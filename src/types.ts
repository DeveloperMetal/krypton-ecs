import { ECS } from '.';
import { Entity } from './entity';

export interface ECSDefine {
  [component: string]: ComponentInterface;
}

export type ECSComponentDefineTypes<E extends ECSDefine> = {
  [K in keyof E]: ComponentFields<E[K]>;
};

/**
 * System event types.
 * The dictiontion between `-ing` and `-ed` events is that of timing.
 * `-ing` events happen after a system completes work while `-ed` events happen after the application
 * loop is updated.
 */
export enum SystemEvent {
  /**
   * Called as an entity is being added after every system call.
   */
  Adding = 1,
  /**
   * Called after an entity is added after the application loop update.
   */
  Added = 2,
  /**
   * Called as an entity is removed after every system call.
   */
  Removing = 4,
  /**
   * Called after an entity is removed after the application loop update.
   */
  Removed = 8,
  /**
   * Called as an entity's component is updated after every system call.
   */
  Modifying = 16,
  /**
   * Called after an entity's component is updated after the application loop update.
   */
  Modified = 32,
}

export type FilterCallback<C extends ECSDefine> = (ecs: ECS<C>, entities: Entity<C>[]) => Entity<C>[];
export type System<C extends ECSDefine> = (ecs: ECS<C>, entities: Entity<C>[]) => Promise<void> | void;

export type ComponentDefinitions = {
  [name: string]: ComponentFields<ComponentInterface>;
};

export type FilterToSystemMap<C extends ECSDefine> = Map<FilterCallback<C>, Set<System<C>>>;

export type FieldTypeof = 'number' | 'string' | 'boolean' | 'object';
export type FieldType = number | string | boolean | object;

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

export type ComponentConstructor<C extends ECSDefine, T extends ComponentInterface> = new (
  id: string,
  fieldDef: ComponentFields<T>,
) => IComponent<C>;
