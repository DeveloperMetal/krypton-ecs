import { ECS } from '.';
import { Entity } from './entity';

export interface ECSDefine {
  [component: string]: IComponent;
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

export const SystemEventInOrder = [
  SystemEvent.Adding,
  SystemEvent.Modifying,
  SystemEvent.Removing,
  SystemEvent.Added,
  SystemEvent.Modified,
  SystemEvent.Removed,
];
export const SystemEdEvents = [SystemEvent.Added, SystemEvent.Modified, SystemEvent.Removed];
export const SystemIngEvents = [SystemEvent.Adding, SystemEvent.Modifying, SystemEvent.Removing];

export type FilterCallback<C extends ECSDefine> = (ecs: ECS<C>, entities: Entity<C>[]) => Entity<C>[];
export type System<C extends ECSDefine> = (ecs: ECS<C>, entities: Entity<C>[]) => Promise<void> | void;

export type ComponentDefinitions = {
  [name: string]: ComponentFields<IComponent>;
};

export type FilterToSystemMap<C extends ECSDefine> = Map<FilterCallback<C>, Set<System<C>>>;

export enum FieldTypeOf {
  number = 0,
  string = 1,
  boolean = 2,
  object = 3,
  float32Array = 4
}
export type FieldType = number | string | boolean | object;

export type FieldDefinition<T> = {
  defaultValue?: T;
  description?: string;
  typeof: FieldTypeOf;
  isArray?: boolean;
  nullable?: boolean;
};

export type ComponentFields<T extends IComponent> = {
  [field in keyof T]: FieldDefinition<T[field]>;
};

export interface IComponentAPI<C extends ECSDefine> {
  $id: string;
  parentEntity: Entity<C>;
  keys(): string[];
  modifiedFields(): (string | number | symbol)[];
}

export interface IComponent {
  [index: string]: FieldType | FieldType[] | null;
}

export type ComponentConstructor<C extends ECSDefine, T extends IComponent> = new (
  id: string,
  fieldDef: ComponentFields<T>,
) => IComponentAPI<C>;
