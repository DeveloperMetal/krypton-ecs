import { ECSDefine, ECSComponentDefineTypes, FilterType, FilterToSystemMap } from "./types";
import { ECS } from ".";
import { Entity } from "./entity";

export class InternalECS<C extends ECSDefine> {
  public entities = new Map<string, Entity<C>>();
  public entitiesByComponent = new Map<keyof C["components"] & string, Set<Entity<C>>>();
  public filters = new Map<FilterType, FilterToSystemMap<C>>();
  public triggerQueue = new Map<FilterType, Set<Entity<C>>>();

  constructor(
    public readonly ecs: ECS<C>, 
    public readonly components: ECSComponentDefineTypes<C>) {
  }

  triggerSystemByFilter(filterType: FilterType, entities: Entity<C>[]) {
    const filter = this.filters.get(filterType);
    
    if ( filter ) {
      for(const [fn, systems] of filter.entries()) {
        for(const system of systems.values()) {
          const filteredEntities = fn(this.ecs, entities);

          system(this.ecs, filteredEntities);

          this.dequeueTrigger(FilterType.Modifying);
          this.dequeueTrigger(FilterType.Adding);
          this.dequeueTrigger(FilterType.Removing);
        }
      }
    }

    if ( filterType === FilterType.Adding ) {
      for(const entity of entities) {
        this.entities.set(entity.$id, entity);
        this.enqueueTrigger(FilterType.Added, entity);
      }
    } else if ( filterType === FilterType.Modifying ) {
      for(const entity of entities) {
        this.enqueueTrigger(FilterType.Modified, entity);
      }
    } else if ( filterType === FilterType.Removing ) {
      for(const entity of entities) {
        this.entities.delete(entity.$id);
        this.enqueueTrigger(FilterType.Removed, entity);
      }
    }
  }

  getQueue(filterType: FilterType) {
    if ( !this.triggerQueue.has(filterType) ) {
      this.triggerQueue.set(filterType, new Set<Entity<C>>());
    }

    return this.triggerQueue.get(filterType) as Set<Entity<C>>;
  }

  resetQueue(filterType: FilterType) {
    this.triggerQueue.delete(filterType);
  }

  enqueueTrigger(filterType: FilterType, entity: Entity<C>) {
    const queue = this.getQueue(filterType);
    queue.add(entity);
  }

  dequeueTrigger(filterType: FilterType) {
    const queue = this.getQueue(filterType);
    const entities = Array.from(queue.values());
    if ( queue.size > 0 ) {
      this.resetQueue(filterType);
      this.triggerSystemByFilter(filterType, entities);
    }
  }

  onComponentAddedToEntity(entity: Entity<C>, component: C["components"] & string) {
    if ( !this.entitiesByComponent.has(component) ) {
      this.entitiesByComponent.set(component, new Set());
    }

    this.entitiesByComponent.get(component)?.add(entity);
  }

  onComponentRemovedFromEntity(entity: Entity<C>, component: keyof C["components"] & string) {
    this.entitiesByComponent.get(component)?.delete(entity);
  }

  update() {
    for(const filter of Object.values(FilterType)) {
      this.dequeueTrigger(filter as FilterType);
    }
  }
}
