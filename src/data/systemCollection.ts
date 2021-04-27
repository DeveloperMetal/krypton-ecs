import { IComponentDefinition } from "types";
import { ECS } from "..";
import { Pipeline } from "./pipeline";
import { IFilter, ISystem } from "./types";

export type QueuePromiseValue = {
  resolve?: (value?: void | PromiseLike<void> | undefined) => void
  reject?: (value?:unknown) => void
  promise?: Promise<void>
}

export class SystemCollection<C extends IComponentDefinition> {
  private _filters = new Map<IFilter | undefined, Set<ISystem>>();

  constructor(public readonly ecs: ECS, public readonly pipeline: Pipeline<C>) { }

  async executeSystems() {
    for(const [filter, systemSet] of this._filters.entries()) {
      let filteredEntities = this.pipeline.entities;
      if ( filter ) {
        filteredEntities = filter(this.ecs, this.pipeline.entities);
      }

      for(const system of systemSet.values()) {
        await system(this.ecs, filteredEntities);
      }
    }
  }

  add(system: ISystem, filter?: IFilter) {
    // Add System set to filter
    if ( !this._filters.has(filter) ) {
      this._filters.set(filter, new Set<ISystem>());
    }

    const filterSystemMap = this._filters.get(filter) as Set<ISystem>;
    filterSystemMap.add(system);
  }

  removeByFilter(filter: IFilter | undefined) {
    if ( this._filters.has(filter) ) {
      return this._filters.delete(filter);
    }
    return false;
  }

  removeSystem(system: ISystem) {
    for(const systemSet of this._filters.values()) {
      if ( systemSet.has(system) ) {
        systemSet.delete(system);
      }
    }
  }

  hasFilter(filter: IFilter) {
    return this._filters.has(filter);
  }

  hasSystem(system: ISystem) {
    for(const systemSet of this._filters.values()) {
      if ( systemSet.has(system) ) {
        return true;
      }
    }

    return false;
  }
}