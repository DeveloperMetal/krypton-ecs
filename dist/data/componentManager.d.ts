import { IComponentDefinition } from "types";
import { ECSBase, Entity } from "..";
import { Component } from "./component";
export declare class ComponentManager<C extends IComponentDefinition> {
    private _ecs;
    private _componentSchemas;
    constructor(_ecs: ECSBase<C>);
    newComponentInstance(name: string, parent: Entity<C>): Component<C>;
    get useTypeGuards(): boolean;
}
//# sourceMappingURL=componentManager.d.ts.map