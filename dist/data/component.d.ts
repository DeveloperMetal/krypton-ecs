import { Entity } from "..";
import { IComponentSchema } from "../schemas/types";
import { Identifiable } from "./utils";
export declare class Component extends Identifiable {
    readonly _schema: IComponentSchema;
    private _parent;
    constructor(_schema: IComponentSchema, _parent: Entity, useTypeGuards?: boolean);
    get parentEntity(): Entity;
    as<T>(): Component & T;
}
//# sourceMappingURL=component.d.ts.map