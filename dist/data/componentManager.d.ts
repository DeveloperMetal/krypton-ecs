import { ECS, Entity } from "..";
import { Component } from "./component";
export declare class ComponentManager {
    private _ecs;
    private _componentSchemas;
    constructor(_ecs: ECS);
    newComponentInstance(name: string, parent: Entity): Component;
    get useTypeGuards(): boolean;
}
//# sourceMappingURL=componentManager.d.ts.map