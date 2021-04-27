import { IComponentDefinition } from "types";
import { ECS } from "..";
import { Entity } from "./entity";
import { SystemCollection } from "./systemCollection";
import { IFilter } from "./types";
export declare class Pipeline<C extends IComponentDefinition> {
    private _ecs;
    private _pipelineEntryFilter?;
    private _pipelineExitFilter?;
    readonly systems: SystemCollection<C>;
    readonly children: Map<string, Pipeline<C>>;
    private readonly _entities;
    constructor(_ecs: ECS, _pipelineEntryFilter?: IFilter | undefined, _pipelineExitFilter?: IFilter | undefined);
    get entityCount(): number;
    get entities(): IterableIterator<Entity<C>>;
    execute(): Promise<void>;
    addEntities(entities: IterableIterator<Entity<C>>): void;
    addEntity(entity: Entity<C>): void;
    removeEntity(entity: Entity<C>, recurively?: boolean): void;
    flush(flushChildren?: boolean): void;
}
//# sourceMappingURL=pipeline.d.ts.map