import { ECSDefine, ECSComponentDefineTypes, FilterType, FilterToSystemMap } from '../types';
import { ECS } from '..';
import { Entity } from '../entity';

/**
 * Internal ECS Api used to manage message passing and caching.
 */
export class InternalECS<C extends ECSDefine> {
  public entities = new Map<string, Entity<C>>();
  public entitiesByComponent = new Map<keyof C['components'] & string, Set<Entity<C>>>();
  public filters = new Map<FilterType, FilterToSystemMap<C>>();
  public triggerQueue = new Map<FilterType, Set<Entity<C>>>();

  /**
   *
   * @param ecs The parent ECS instance linking all apis.
   * @param components The user defined component definition.
   */
  constructor(public readonly ecs: ECS<C>, public readonly components: ECSComponentDefineTypes<C>) {}

  /**
   * Broadcasts a trigger event to subscribed systems.
   * @param filterType Filter trigger type
   * @param entities Entities to send.
   */
  triggerSystemByFilter(filterType: FilterType, entities: Entity<C>[]) {
    const filter = this.filters.get(filterType);

    if (filter) {
      for (const [fn, systems] of filter.entries()) {
        for (const system of systems.values()) {
          const filteredEntities = fn(this.ecs, entities);

          system(this.ecs, filteredEntities);

          this.dequeueTrigger(FilterType.Modifying);
          this.dequeueTrigger(FilterType.Adding);
          this.dequeueTrigger(FilterType.Removing);
        }
      }
    }

    if (filterType === FilterType.Adding) {
      for (const entity of entities) {
        this.entities.set(entity.$id, entity);
        this.enqueueTrigger(FilterType.Added, entity);
      }
    } else if (filterType === FilterType.Modifying) {
      for (const entity of entities) {
        this.enqueueTrigger(FilterType.Modified, entity);
      }
    } else if (filterType === FilterType.Removing) {
      for (const entity of entities) {
        this.entities.delete(entity.$id);
        this.enqueueTrigger(FilterType.Removed, entity);
      }
    }
  }

  /**
   * Gets a trigger queue where system events are stored.
   * @param filterType Trigger filter type
   */
  getQueue(filterType: FilterType) {
    if (!this.triggerQueue.has(filterType)) {
      this.triggerQueue.set(filterType, new Set<Entity<C>>());
    }

    return this.triggerQueue.get(filterType) as Set<Entity<C>>;
  }

  /**
   * Empties an event queue by trigger type.
   * @param filterType Trigger filter type
   */
  resetQueue(filterType: FilterType) {
    this.triggerQueue.delete(filterType);
  }

  /**
   * Enqueues an entity into a queue defined by a trigger filter type.
   * @param filterType Trigger filter type.
   * @param entity An entity to enqueue.
   */
  enqueueTrigger(filterType: FilterType, entity: Entity<C>) {
    const queue = this.getQueue(filterType);
    queue.add(entity);
  }

  /**
   * Triggers a queue defined by a filter type and resets the queue.
   * @param filterType Trigger filter type.
   */
  dequeueTrigger(filterType: FilterType) {
    const queue = this.getQueue(filterType);
    const entities = Array.from(queue.values());
    if (queue.size > 0) {
      this.resetQueue(filterType);
      this.triggerSystemByFilter(filterType, entities);
    }
  }

  /**
   * Helper method. Helps track entities to component links.
   * @param entity An entity which a component was added.
   * @param component The new component added.
   */
  onComponentAddedToEntity(entity: Entity<C>, component: C['components'] & string) {
    let group: Set<Entity<C>>;
    if (!this.entitiesByComponent.has(component)) {
      this.entitiesByComponent.set(component, (group = new Set()));
    } else {
      group = this.entitiesByComponent.get(component) as Set<Entity<C>>;
    }

    group.add(entity);
  }

  /**
   * Helper method. Helps track entities to component links.
   * @param entity The entity which a component was removed.
   * @param component The component removed.
   */
  onComponentRemovedFromEntity(entity: Entity<C>, component: keyof C['components'] & string) {
    if (this.entitiesByComponent.has(component)) {
      const group = this.entitiesByComponent.get(component) as Set<Entity<C>>;
      group.delete(entity);
    }
  }

  /**
   * In an application loop, this method will trigger the `-ed` events such as `Added`, `Removed`, `Modified` events.
   */
  update() {
    for (const filter of Object.values(FilterType)) {
      this.dequeueTrigger(filter as FilterType);
    }
  }
}
