import { IComponents } from "schemas";
import { IDefinitions } from "types";
import { ECSBase } from "..";
import { Pipeline } from "./pipeline";
import { IFilter, ISystem } from "../types";

export type QueuePromiseValue = {
  resolve?: (value?: void | PromiseLike<void> | undefined) => void
  reject?: (value?:unknown) => void
  promise?: Promise<void>
}

export class SystemCollection<D extends IDefinitions, C extends IComponents> {
  private _filters = new Map<IFilter<D, C> | undefined, Set<ISystem<D, C>>>();

  constructor(public readonly ecs: ECSBase<D, C>, public readonly pipeline: Pipeline<D, C>) { }

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

  add(system: ISystem<D, C>, filter?: IFilter<D, C>) {
    // Add System set to filter
    if ( !this._filters.has(filter) ) {
      this._filters.set(filter, new Set<ISystem<D, C>>());
    }

    const filterSystemMap = this._filters.get(filter) as Set<ISystem<D, C>>;
    filterSystemMap.add(system);
  }

  removeByFilter(filter: IFilter<D, C> | undefined) {
    if ( this._filters.has(filter) ) {
      return this._filters.delete(filter);
    }
    return false;
  }

  removeSystem(system: ISystem<D, C>) {
    for(const systemSet of this._filters.values()) {
      if ( systemSet.has(system) ) {
        systemSet.delete(system);
      }
    }
  }

  hasFilter(filter: IFilter<D, C>) {
    return this._filters.has(filter);
  }

  hasSystem(system: ISystem<D, C>) {
    for(const systemSet of this._filters.values()) {
      if ( systemSet.has(system) ) {
        return true;
      }
    }

    return false;
  }
}