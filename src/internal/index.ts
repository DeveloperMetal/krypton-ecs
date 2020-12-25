import {
  SystemEvent,
  FilterToSystemMap,
  ECSComponentDefineTypes,
  ECSDefine,
  ComponentFields,
  IComponent,
  SystemIngEvents,
  SystemEventInOrder,
} from '../types';
import { ECS } from '..';
import { Entity } from '../entity';

/**
 * Internal ECS Api used to manage message passing and caching.
 */
export class InternalECS<C extends ECSDefine> {
  public entities = new Map<string, Entity<C>>();
  public entitiesByComponent = new Map<string, Set<Entity<C>>>();
  public filters = new Map<SystemEvent, FilterToSystemMap<C>>();
  public triggerQueue = new Map<SystemEvent, Set<Entity<C>>>();
  public components = new Map<string, ComponentFields<IComponent>>();

  /**
   *
   * @param ecs The parent ECS instance linking all apis.
   * @param components The user defined component definition.
   */
  constructor(public readonly ecs: ECS<C>) {}

  defineComponent(components: ECSComponentDefineTypes<C>) {
    for (const key of Object.keys(components)) {
      this.components.set(key, components[key]);
    }
  }

  /**
   * Broadcasts a trigger event to subscribed systems.
   * @param event Filter trigger type
   * @param entities Entities to send.
   */
  triggerSystemByFilter(event: SystemEvent, entities: Entity<C>[]) {
    const filter = this.filters.get(event);

    if (filter) {
      for (const [fn, systems] of filter.entries()) {
        const filteredEntities = fn(this.ecs, entities);
        for (const system of systems.values()) {
          system(this.ecs, filteredEntities);
        }
      }

      // trigger -ing events after system call
      for (const ingEvent of Object.values(SystemIngEvents)) {
        this.dequeueTrigger(ingEvent);
      }
    }

    // queue -ed events after -ing events have run
    if (event === SystemEvent.Adding) {
      for (const entity of entities) {
        this.entities.set(entity.$id, entity);
        this.enqueueTrigger(SystemEvent.Added, entity);
      }
    } else if (event === SystemEvent.Modifying) {
      for (const entity of entities) {
        this.enqueueTrigger(SystemEvent.Modified, entity);
      }
    } else if (event === SystemEvent.Removing) {
      for (const entity of entities) {
        this.entities.delete(entity.$id);
        this.enqueueTrigger(SystemEvent.Removed, entity);
      }
    } else if (event === SystemEvent.Modified) {
      entities.forEach((e) => e.resetModifiedComponents());
    }
  }

  /**
   * Gets a trigger queue where system events are stored.
   * @param event Trigger system event
   */
  getQueue(event: SystemEvent) {
    if (!this.triggerQueue.has(event)) {
      this.triggerQueue.set(event, new Set<Entity<C>>());
    }

    return this.triggerQueue.get(event) as Set<Entity<C>>;
  }

  /**
   * Empties an event queue by trigger type.
   * @param event Trigger system event
   */
  resetQueue(event: SystemEvent) {
    this.triggerQueue.delete(event);
  }

  /**
   * Enqueues an entity into a queue defined by a trigger system event.
   * @param event Trigger system event.
   * @param entity An entity to enqueue.
   */
  enqueueTrigger(event: SystemEvent, entity: Entity<C>) {
    const queue = this.getQueue(event);
    queue.add(entity);
  }

  /**
   * Triggers a queue defined by a system event and resets the queue.
   * @param event Trigger system event.
   */
  dequeueTrigger(event: SystemEvent) {
    const queue = this.getQueue(event);
    if (queue.size > 0) {
      const entities = Array.from(queue.values());
      this.resetQueue(event);
      this.triggerSystemByFilter(event, entities);
    }
  }

  /**
   * Helper method. Helps track entities to component links.
   * @param entity An entity which a component was added.
   * @param component The new component added.
   */
  onComponentAddedToEntity(entity: Entity<C>, component: string) {
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
  onComponentRemovedFromEntity(entity: Entity<C>, component: string) {
    if (this.entitiesByComponent.has(component)) {
      const group = this.entitiesByComponent.get(component) as Set<Entity<C>>;
      group.delete(entity);
    }
  }

  /**
   * In an application loop, this method will trigger the `-ed` events such as `Added`, `Removed`, `Modified` events.
   */
  update() {
    for (const filter of Object.values(SystemEventInOrder)) {
      this.dequeueTrigger(filter as SystemEvent);
    }
  }
}
