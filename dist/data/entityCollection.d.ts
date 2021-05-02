import { ECSBase } from "..";
import { ECSEntity } from ".";
import { IComponents, IEntitySchema } from "../schemas/types";
import { IDefinitions } from "types";
export interface IQuery {
    [key: string]: string;
}
export declare class EntityCollection<D extends IDefinitions, C extends IComponents> {
    private readonly _ecs;
    private _entities;
    constructor(_ecs: ECSBase<D, C>);
    add(schema: IEntitySchema<C> | ECSEntity<D, C>): ECSEntity<D, C>;
    remove(id: string): boolean;
    get(id: string): ECSEntity<D, C> | undefined;
    has(id: string): boolean;
    values(): IterableIterator<ECSEntity<D, C>>;
    count(): number;
}
//# sourceMappingURL=entityCollection.d.ts.map