import { IComponentName } from "schemas";
import { IComponentDefinition } from "types";
import { ECSBase, Entity } from "..";
export declare enum EntityState {
    None = 0,
    Adding = 1,
    Added = 2,
    Ready = 3,
    Removing = 4,
    Removed = 5
}
export declare type IFilter<D extends IComponentDefinition, C extends IComponentName> = (ecs: ECSBase<D, C>, entities: IterableIterator<Entity<D, C>>) => IterableIterator<Entity<D, C>>;
export declare type ISystem<D extends IComponentDefinition, C extends IComponentName> = (ecs: ECSBase<D, C>, entities: IterableIterator<Entity<D, C>>) => Promise<void> | void;
export declare type FilterPredicate<T> = (item: T, index: number) => boolean;
//# sourceMappingURL=types.d.ts.map