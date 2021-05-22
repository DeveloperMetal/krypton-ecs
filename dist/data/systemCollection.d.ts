import { IComponents } from "../schemas";
import { ECSBase } from "..";
import { Pipeline } from "./pipeline";
import { IDefinitions, IFilter, ISystem } from "../types";
export declare type QueuePromiseValue = {
    resolve?: (value?: void | PromiseLike<void> | undefined) => void;
    reject?: (value?: unknown) => void;
    promise?: Promise<void>;
};
export declare class SystemCollection<D extends IDefinitions, C extends IComponents> {
    readonly ecs: ECSBase<D, C>;
    readonly pipeline: Pipeline<D, C>;
    private _filters;
    constructor(ecs: ECSBase<D, C>, pipeline: Pipeline<D, C>);
    executeSystems(): Promise<void>;
    add(system: ISystem<D, C>, filter?: IFilter<D, C>): void;
    removeByFilter(filter: IFilter<D, C> | undefined): boolean;
    removeSystem(system: ISystem<D, C>): void;
    hasFilter(filter: IFilter<D, C>): boolean;
    hasSystem(system: ISystem<D, C>): boolean;
}
//# sourceMappingURL=systemCollection.d.ts.map