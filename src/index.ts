import { Entity } from './entity';
import { ECSDefine, ECSComponentDefineTypes, SystemEvent, FilterCallback, System } from './types';
import { InternalECS } from './internal';
export * from './types';
export * from './entity';
export * from './component';
export * from './internal';

/**
 * Type safe ECS system entry point.
 */
export class ECS<C extends ECSDefine> {
  private _internal: InternalECS<C>;

  constructor(components: ECSComponentDefineTypes<C>) {
    this._internal = new InternalECS(this);
    this.addComponent(components);
  }

  addComponent(components: ECSComponentDefineTypes<C>) {
    this._internal.defineComponent(components);
  }

  /**
   * Returns an entity by its name
   * @param name Entity name
   */
  entity(id: string) {
    if ( this._internal.entities.has(id) ) {
      return this._internal.entities.get(id) as Entity<C>;
    } else {
      throw new Error(`Entity not found: ${id}`);
    }
  }

  /**
   * Returns true or false if entity exists in the system.
   * @param id The entity id.
   */
  entityExists(id: string) {
    return this._internal.entities.has(id);
  }

  /**
   * Returns entities containing the provided component.
   * @param component Component name
   * @returns Array of entitities.
   */
  entitiesByComponent<K extends keyof C>(component: K) {
    return this._internal.entitiesByComponent.get(component as string)?.values() || [].values();
  }

  /**
   * Adds an entity to the system. Pass component names to preseed the entity.
   * @param id The entity id
   * @param components Component names to add into the entity.
   */
  addEntity(id: string, ...components: (keyof C)[]) {
    const entity = new Entity<C>(id, this._internal);
    for (const component of components) {
      entity.add(component as string);
    }
    this._internal.enqueueTrigger(SystemEvent.Adding, entity);
    return entity;
  }

  /**
   * Removes an entity by its id
   * @param id Entity name
   */
  removeEntity(id: string) {
    const entity = this._internal.entities.get(id);
    if (entity) {
      this._internal.enqueueTrigger(SystemEvent.Removing, entity);
      return true;
    }

    return false;
  }

  /**
   * Adds a system and attaches it to a trigger event and filter query.
   * @param type The trigger system event.
   * @param filter A callback function to filter entities before they make it to the System
   * @param system A callback function which functions as a system.
   */
  addSystem(type: SystemEvent, filter: FilterCallback<C>, system: System<C>) {
    let typeQueue: Map<FilterCallback<C>, Set<System<C>>>;
    let filterMap: Set<System<C>>;

    if (!this._internal.filters.has(type)) {
      this._internal.filters.set(type, (typeQueue = new Map<FilterCallback<C>, Set<System<C>>>()));
    } else {
      typeQueue = this._internal.filters.get(type) as Map<FilterCallback<C>, Set<System<C>>>;
    }

    if (!typeQueue.has(filter)) {
      typeQueue.set(filter, (filterMap = new Set<System<C>>()));
    } else {
      filterMap = typeQueue.get(filter) as Set<System<C>>;
    }

    filterMap.add(system);

    return this;
  }

  /**
   * Removes a system matching trigger and filter.
   * @param type The trigger type to match.
   * @param filter The filter callback used to trigger this system.
   * @param system The system to remove.
   */
  removeSystem(type: SystemEvent, filter: FilterCallback<C>, system: System<C>) {
    let typeQueue: Map<FilterCallback<C>, Set<System<C>>>;
    let filterMap: Set<System<C>>;

    if (this._internal.filters.has(type)) {
      typeQueue = this._internal.filters.get(type) as Map<FilterCallback<C>, Set<System<C>>>;
      if (typeQueue.has(filter)) {
        filterMap = typeQueue.get(filter) as Set<System<C>>;
        return filterMap.delete(system);
      }
    }

    return false;
  }

  /**
   * Removes all systems defined by the trigger and filter combo.
   * @param type The trigger type to match.
   * @param filter The filter callback used to trigger one ore more systems.
   */
  removeSystemsByFilter(type: SystemEvent, filter: FilterCallback<C>) {
    let typeQueue: Map<FilterCallback<C>, Set<System<C>>>;
    let filterMap: Set<System<C>>;

    if (this._internal.filters.has(type)) {
      typeQueue = this._internal.filters.get(type) as Map<FilterCallback<C>, Set<System<C>>>;

      if (typeQueue.has(filter)) {
        filterMap = typeQueue.get(filter) as Set<System<C>>;
        filterMap.clear();
        return true;
      }
    }

    return false;
  }

  /**
   * System is defined and running.
   * @param type The trigger type where the system should exist.
   * @param filter The filter callback used to trigger this system.
   * @param system The system callback to check.
   */
  systemExists(type: SystemEvent, filter: FilterCallback<C>, system: System<C>) {
    let typeQueue: Map<FilterCallback<C>, Set<System<C>>>;
    let filterMap: Set<System<C>>;

    if (this._internal.filters.has(type)) {
      typeQueue = this._internal.filters.get(type) as Map<FilterCallback<C>, Set<System<C>>>;
      if (typeQueue.has(filter)) {
        filterMap = typeQueue.get(filter) as Set<System<C>>;
        return filterMap.has(system);
      }
    }

    return false;
  }

  /**
   * Triggers async systems such as added, modified and removed triggers.
   */
  update() {
    this._internal.update();
  }
}
