import { Entity } from './entity';
import { ECSDefine, ECSComponentDefineTypes, FilterType, FilterCallback, System } from './types';
import { InternalECS } from './internal';

export class ECS<C extends ECSDefine> {
  private _internal: InternalECS<C>;

  constructor(components: ECSComponentDefineTypes<C>) {
    this._internal = new InternalECS<C>(this, components);
  }

  /**
   * Returns an entity by its name
   * @param name Entity name
   */
  entity(id: string) {
    return this._internal.entities.get(id);
  }

  entitiesByComponent<K extends keyof C["components"] & string>
    (component: K)
  {
    return this._internal.entitiesByComponent.get(component)?.values() || [].values()
  }

  addComponent<
    K extends keyof C['components'] & string
  > (entity: Entity<C>, component: K) {
    return entity.addComponent(component)
  }

  /**
   * Adds an entity track
   * @param entity Entity object
   */
  addEntity(id: string, ...components: (keyof C['components'])[]) {
    const entity = new Entity<C>(id, this._internal);
    for(const component of components) {
      this.addComponent(entity, component as string);
    }
    this._internal.enqueueTrigger(FilterType.Adding, entity);
    return entity;
  }

  /**
   *
   * @param id Entity name
   */
  removeEntity(id: string) {
    const entity = this._internal.entities.get(id);
    if ( entity ) {
      this._internal.enqueueTrigger(FilterType.Removing, entity);
    }
  }

  addSystem(type: FilterType, filter: FilterCallback<C>, system: System<C>) {

    if ( !this._internal.filters.has(type) ) {
      this._internal.filters.set(type, new Map<FilterCallback<C>, Set<System<C>>>());
    }

    if ( this._internal.filters.has(type) && !this._internal.filters.get(type)?.has(filter) ) {
      this._internal.filters.get(type)?.set(filter, new Set<System<C>>());
    }

    this._internal.filters.get(type)?.get(filter)?.add(system);

    return this;
  }

  removeSystem(type: FilterType, filter: FilterCallback<C>, system: System<C>) {
    return this._internal.filters.get(type)?.get(filter)?.delete(system) || false;
  }

  removeSystemsByFilter(type: FilterType, filter: FilterCallback<C>) {
    return this._internal.filters.get(type)?.delete(filter) || false;
  }

  update() {
    this._internal.update();
  }
}