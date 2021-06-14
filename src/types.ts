import { IComponents, IECSSchema } from "./schemas";
import { ECSBase, ECSEntity } from ".";

export enum EntityState {
  None = 0,
  Adding = 1,
  Added = 2,
  Ready = 3,
  Removing = 4,
  Removed = 5
}

export type IFilter<D extends IDefinitions, C extends IComponents> = (ecs: ECSBase<D, C>, entities: IterableIterator<ECSEntity<D, C>>) => IterableIterator<ECSEntity<D, C>>;

export type ISystem<D extends IDefinitions, C extends IComponents> = (ecs: ECSBase<D, C>, entities: IterableIterator<ECSEntity<D, C>>) => Promise<void> | void;

export type FilterPredicate<T> = (item: T, index: number) => boolean;
export interface ECSOpts<C extends IComponents> {
  readonly name?: string
  readonly schema: IECSSchema<C>,
  useTypeGuards?: boolean,
}

export interface IDefinitions {
  [name: string]: any
}