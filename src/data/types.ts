import { IComponentDefinition } from "types";
import { ECSBase, Entity } from "..";

export enum EntityState {
  None = 0,
  Adding = 1,
  Added = 2,
  Ready = 3,
  Removing = 4,
  Removed = 5
}

export type IFilter = <C extends IComponentDefinition>(ecs: ECSBase<C>, entities: IterableIterator<Entity<C>>) => IterableIterator<Entity<C>>;

export type ISystem = <C extends IComponentDefinition>(ecs: ECSBase<C>, entities: IterableIterator<Entity<C>>) => Promise<void> | void;

export type FilterPredicate<T> = (item: T, index: number) => boolean;