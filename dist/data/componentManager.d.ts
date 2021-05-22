import { IComponents } from "../schemas";
import { IDefinitions } from "../types";
import { ECSBase, ECSEntity } from "..";
import { Component } from "./component";
export declare class ComponentManager<D extends IDefinitions, C extends IComponents> {
    private _ecs;
    private _componentSchemas;
    constructor(_ecs: ECSBase<D, C>);
    newComponentInstance(name: string, parent: ECSEntity<D, C>): Component<D, C>;
    get useTypeGuards(): boolean;
}
//# sourceMappingURL=componentManager.d.ts.map