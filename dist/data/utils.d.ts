import { ECS } from "..";
import { FilterPredicate } from "./types";
export declare function filter<T>(iterable: IterableIterator<T>, predicate: FilterPredicate<T>): Generator<T, void, unknown>;
export declare function genFilterPredicate<T>(predicate: FilterPredicate<T>): (_ecs: ECS, entities: IterableIterator<T>) => Generator<T, void, unknown>;
export declare class Identifiable {
    private _$id;
    constructor($id: string);
    get $id(): string;
}
//# sourceMappingURL=utils.d.ts.map