import { IComponentDefinition } from "types";
import { Entity } from "..";
import { IComponentSchema } from "../schemas/types";
import { Identifiable } from "./utils";
export declare class Component<C extends IComponentDefinition> extends Identifiable {
    readonly _schema: IComponentSchema;
    private _parent;
    constructor(_schema: IComponentSchema, _parent: Entity<C>, useTypeGuards?: boolean);
    get parentEntity(): Entity<C>;
    as<T>(): Component<C> & T;
}
//# sourceMappingURL=component.d.ts.map