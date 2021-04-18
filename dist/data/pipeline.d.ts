import { ECS } from "..";
import { Entity } from "./entity";
import { SystemCollection } from "./systemCollection";
import { IFilter } from "./types";
export declare class Pipeline {
    private _ecs;
    private _pipelineEntryFilter?;
    private _pipelineExitFilter?;
    readonly systems: SystemCollection;
    readonly children: Map<string, Pipeline>;
    private readonly _entities;
    constructor(_ecs: ECS, _pipelineEntryFilter?: IFilter | undefined, _pipelineExitFilter?: IFilter | undefined);
    get entityCount(): number;
    get entities(): IterableIterator<Entity>;
    execute(): Promise<void>;
    addEntities(entities: IterableIterator<Entity>): void;
    addEntity(entity: Entity): void;
    removeEntity(entity: Entity, recurively?: boolean): void;
    flush(flushChildren?: boolean): void;
}
//# sourceMappingURL=pipeline.d.ts.map