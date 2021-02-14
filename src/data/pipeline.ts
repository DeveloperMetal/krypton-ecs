import { ECS, Entity } from "..";
import { SystemCollection } from "./systemCollection";
import { IFilter } from "./types";

/**
 * An execution pipeline to handle tight control of systems execution and orchestration.
 */
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

  /**
   * Executes pipeline, calling child pipelines in added order.
   */
  execute() {
    this.systems.executeSystems();

    // 1) transition entities into next child entities.
    for(const child of this.children.values()) {
      child.addEntities(this._entities.values());
      child.execute();
    }

    // 2) revise entities in pipeline on exit.
    //    can be used to move entities along a long process when needed.
    if ( this._pipelineExitFilter ) {
      const exitEntities = this._pipelineExitFilter(this._ecs, this._entities.values());

      this._entities.clear();
      for(const entity of exitEntities) {
        this._entities.add(entity);
      }
    }
  }

  /**
   * Adds multiple entities into pipeline. When a pipeline entry filter is defined this method will
   * run all passed entities through that filter before adding them.
   * @param entities An iterable list of entities to add into the pipeline.
   */
  addEntities(entities: IterableIterator<Entity>) {
    let filteredEntities = entities;
    if ( this._pipelineEntryFilter ) {
      filteredEntities = this._pipelineEntryFilter(this._ecs, entities);
    }

    for(const entity of filteredEntities) {
      this._entities.add(entity);
    }
  }

  /**
   * Adds a single entity to the pipeline. Filter rules still aplly here.
   * @see addEntities
   * @param entity
   */
  addEntity(entity: Entity) {
    this.addEntities([entity].values());
  }

  /**
   * Removes an entity from the pipeline. Optionally will remove from every child pipeline recursevly.
   * @param entity The entity to remove
   */
  removeEntity(entity: Entity, recurively: boolean = false) {
    this._entities.delete(entity);

    if ( recurively ) {
      for(const child of this.children.values()) {
        child.removeEntity(entity);
      }
    }
  }

  /**
   * Empties the pipeline. Optionally will empty all child pipelines.
   * @param flushChildren Set to true to recursevly flush all child pipelines.
   */
  flush(flushChildren: boolean = false) {
    this._entities.clear();

    if ( flushChildren ) {
      for(const child of this.children.values()) {
        child.flush(flushChildren);
      }
    }
  }
}