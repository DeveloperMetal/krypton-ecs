import { IDefinitions } from "../types";
import { ECSEntity } from "..";
import { IComponents, IComponentSchema } from "../schemas/types";
import { Identifiable } from "./utils";
export declare class Component<C extends IDefinitions, COMPS extends IComponents> extends Identifiable {
    readonly _schema: IComponentSchema;
    private _parent;
    constructor(_schema: IComponentSchema, _parent: ECSEntity<C, COMPS>, useTypeGuards?: boolean);
    get parentEntity(): ECSEntity<C, COMPS>;
    as<T>(): Component<C, COMPS> & T;
}
//# sourceMappingURL=component.d.ts.map