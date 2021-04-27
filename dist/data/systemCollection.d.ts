import { IComponentDefinition } from "types";
import { ECS } from "..";
import { Pipeline } from "./pipeline";
import { IFilter, ISystem } from "./types";
export declare type QueuePromiseValue = {
    resolve?: (value?: void | PromiseLike<void> | undefined) => void;
    reject?: (value?: unknown) => void;
    promise?: Promise<void>;
};
export declare class SystemCollection<C extends IComponentDefinition> {
    readonly ecs: ECS;
    readonly pipeline: Pipeline<C>;
    private _filters;
    constructor(ecs: ECS, pipeline: Pipeline<C>);
    executeSystems(): Promise<void>;
    add(system: ISystem, filter?: IFilter): void;
    removeByFilter(filter: IFilter | undefined): boolean;
    removeSystem(system: ISystem): void;
    hasFilter(filter: IFilter): boolean;
    hasSystem(system: ISystem): boolean;
}
//# sourceMappingURL=systemCollection.d.ts.map