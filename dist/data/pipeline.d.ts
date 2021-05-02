import { IComponents } from "schemas";
import { IDefinitions } from "types";
import { ECSBase } from "..";
import { ECSEntity } from "./entity";
import { SystemCollection } from "./systemCollection";
import { IFilter } from "../types";
export declare class Pipeline<D extends IDefinitions, C extends IComponents> {
    private _ecs;
    private _pipelineEntryFilter?;
    private _pipelineExitFilter?;
    readonly systems: SystemCollection<D, C>;
    readonly children: Map<string, Pipeline<D, C>>;
    private readonly _entities;
    constructor(_ecs: ECSBase<D, C>, _pipelineEntryFilter?: IFilter<D, C> | undefined, _pipelineExitFilter?: IFilter<D, C> | undefined);
    get entityCount(): number;
    get entities(): IterableIterator<ECSEntity<D, C>>;
    execute(): Promise<void>;
    addEntities(entities: IterableIterator<ECSEntity<D, C>>): void;
    addEntity(entity: ECSEntity<D, C>): void;
    removeEntity(entity: ECSEntity<D, C>, recurively?: boolean): void;
    flush(flushChildren?: boolean): void;
}
//# sourceMappingURL=pipeline.d.ts.map