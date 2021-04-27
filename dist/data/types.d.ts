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
export declare type IFilter = <C extends IComponentDefinition>(ecs: ECSBase<C>, entities: IterableIterator<Entity<C>>) => IterableIterator<Entity<C>>;
export declare type ISystem = <C extends IComponentDefinition>(ecs: ECSBase<C>, entities: IterableIterator<Entity<C>>) => Promise<void> | void;
export declare type FilterPredicate<T> = (item: T, index: number) => boolean;
//# sourceMappingURL=types.d.ts.map