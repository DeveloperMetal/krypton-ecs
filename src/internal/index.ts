import {
  SystemEvent,
  FilterToSystemMap,
  ECSComponentDefineTypes,
  ECSDefine,
  ComponentFields,
  ComponentInterface,
} from '../types';
import { ECS } from '..';
import { Entity } from '../entity';

/**
 * Internal ECS Api used to manage message passing and caching.
 */
export class InternalECS {
  public entities = new Map<string, Entity>();
  public entitiesByComponent = new Map<string, Set<Entity>>();
  public filters = new Map<SystemEvent, FilterToSystemMap>();
  public triggerQueue = new Map<SystemEvent, Set<Entity>>();
  public components = new Map<string, ComponentFields<ComponentInterface>>();

  /**
   *
   * @param ecs The parent ECS instance linking all apis.
   * @param components The user defined component definition.
   */
  constructor(public readonly ecs: ECS, components: ECSComponentDefineTypes<ECSDefine>) {
    for (const key of Object.keys(components)) {
      this.components.set(key, components[key]);
    }
  }

  /**
   * Broadcasts a trigger event to subscribed systems.
   * @param event Filter trigger type
   * @param entities Entities to send.
   */
  triggerSystemByFilter(event: SystemEvent, entities: Entity[]) {
    const filter = this.filters.get(event);

    if (filter) {
      for (const [fn, systems] of filter.entries()) {
        for (const system of systems.values()) {
          const filteredEntities = fn(this.ecs, entities);

          system(this.ecs, filteredEntities);

          this.dequeueTrigger(SystemEvent.Adding);
          this.dequeueTrigger(SystemEvent.Modifying);
          this.dequeueTrigger(SystemEvent.Removing);
        }
      }
    }

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
    }
  }

  /**
   * Gets a trigger queue where system events are stored.
   * @param event Trigger system event
   */
  getQueue(event: SystemEvent) {
    if (!this.triggerQueue.has(event)) {
      this.triggerQueue.set(event, new Set<Entity>());
    }

    return this.triggerQueue.get(event) as Set<Entity>;
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
  enqueueTrigger(event: SystemEvent, entity: Entity) {
    const queue = this.getQueue(event);
    queue.add(entity);
  }

  /**
   * Triggers a queue defined by a system event and resets the queue.
   * @param event Trigger system event.
   */
  dequeueTrigger(event: SystemEvent) {
    const queue = this.getQueue(event);
    const entities = Array.from(queue.values());
    if (queue.size > 0) {
      this.resetQueue(event);
      this.triggerSystemByFilter(event, entities);
    }
  }

  /**
   * Helper method. Helps track entities to component links.
   * @param entity An entity which a component was added.
   * @param component The new component added.
   */
  onComponentAddedToEntity(entity: Entity, component: string) {
    let group: Set<Entity>;
    if (!this.entitiesByComponent.has(component)) {
      this.entitiesByComponent.set(component, (group = new Set()));
    } else {
      group = this.entitiesByComponent.get(component) as Set<Entity>;
    }

    group.add(entity);
  }

  /**
   * Helper method. Helps track entities to component links.
   * @param entity The entity which a component was removed.
   * @param component The component removed.
   */
  onComponentRemovedFromEntity(entity: Entity, component: string) {
    if (this.entitiesByComponent.has(component)) {
      const group = this.entitiesByComponent.get(component) as Set<Entity>;
      group.delete(entity);
    }
  }

  /**
   * In an application loop, this method will trigger the `-ed` events such as `Added`, `Removed`, `Modified` events.
   */
  update() {
    for (const filter of Object.values(SystemEvent)) {
      this.dequeueTrigger(filter as SystemEvent);
    }
  }
}
