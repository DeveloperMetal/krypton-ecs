import { ECSBase } from "..";
import { Entity } from ".";
import { IEntitySchema } from "../schemas/types";
import { IComponentDefinition } from "types";
export interface IQuery {
    [key: string]: string;
}
export declare class EntityCollection<C extends IComponentDefinition> {
    private readonly _ecs;
    private _entities;
    constructor(_ecs: ECSBase<C>);
    add(schema: IEntitySchema): Entity<C>;
    remove(id: string): boolean;
    get(id: string): Entity<C> | undefined;
    has(id: string): boolean;
    values(): IterableIterator<Entity<C>>;
    count(): number;
}
//# sourceMappingURL=entityCollection.d.ts.map