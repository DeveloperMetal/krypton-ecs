import { ISystem } from ".";
import { ECS, Entity } from "..";
import { SystemCollection } from "./systemCollection";
import { IFilter } from "./types";

export class Pipeline {
  public readonly systems: SystemCollection;
  public readonly children = new Map<string, Pipeline>();
  
  private readonly _entities = new Set<Entity>();

  constructor(private _ecs: ECS, private _pipelineEntryFilter?: IFilter, private _pipelineExitFilter?: IFilter) {
    this.systems = new SystemCollection(this._ecs, this);
  }

  get entities() {
    return this._entities.values();
  }

  execute() {
    this.systems.executeSystems();

    // transition entities into next child entities
    for(const child of this.children.values()) {
      child.addEntities(this._entities.values());
      child.execute();
    }

    // revise entities in pipeline on exit
    if ( this._pipelineExitFilter ) {
      const exitEntities = this._pipelineExitFilter(this._ecs, this._entities.values());

      this._entities.clear();
      for(const entity of exitEntities) {
        this._entities.add(entity);
      }
    }
  }

  addEntities(entities: IterableIterator<Entity>) {
    let filteredEntities = entities;
    if ( this._pipelineEntryFilter ) {
      filteredEntities = this._pipelineEntryFilter(this._ecs, entities);
    }

    for(const entity of filteredEntities) {
      this._entities.add(entity);
    }
  }

  addEntity(entity: Entity) {
    this.addEntities([entity].values());
  }

  removeEntity(entity: Entity) {
    this._entities.delete(entity);

    for(const child of this.children.values()) {
      child.removeEntity(entity);
    }
  }

  flush(flushChildren: boolean = false) {
    this._entities.clear();
    
    if ( flushChildren ) {
      for(const child of this.children.values()) {
        child.flush(flushChildren);
      }
    }
  }
}