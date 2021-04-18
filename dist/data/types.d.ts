import { ECS, Entity } from "..";
export declare enum EntityState {
    None = 0,
    Adding = 1,
    Added = 2,
    Ready = 3,
    Removing = 4,
    Removed = 5
}
export declare type IFilter = (ecs: ECS, entities: IterableIterator<Entity>) => IterableIterator<Entity>;
export declare type ISystem = (ecs: ECS, entities: IterableIterator<Entity>) => Promise<void> | void;
export declare type FilterPredicate<T> = (item: T, index: number) => boolean;
//# sourceMappingURL=types.d.ts.map