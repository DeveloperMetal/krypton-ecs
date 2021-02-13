import { ECS, Entity } from "..";

export enum EntityState {
  None = 0,
  Adding = 1,
  Added = 2,
  Ready = 3,
  Removing = 4,
  Removed = 5
}

export type IFilter = (ecs: ECS, entities: IterableIterator<Entity>) => IterableIterator<Entity>;

export type ISystem = (ecs: ECS, entities: IterableIterator<Entity>) => Promise<void> | void;

export type FilterPredicate<T> = (item: T, index: number) => boolean;