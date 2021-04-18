import { ECS } from "..";
import { Entity } from ".";
import { IEntitySchema } from "../schemas/types";
export interface IQuery {
    [key: string]: string;
}
export declare class EntityCollection {
    private readonly _ecs;
    private _entities;
    constructor(_ecs: ECS);
    add(schema: IEntitySchema): void;
    remove(id: string): boolean;
    get(id: string): Entity | undefined;
    has(id: string): boolean;
    values(): IterableIterator<Entity>;
    count(): number;
}
//# sourceMappingURL=entityCollection.d.ts.map