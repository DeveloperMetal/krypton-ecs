import { Entity } from './entity';

export class ECS {
  private _entities = new Map<string, Entity>();

  /**
   * Returns an entity by its name
   * @param name Entity name
   */
  entity(id: string) {
    return this._entities.get(id);
  }

  /**
   * Adds an entity track
   * @param entity Entity object
   */
  addEntity(entity: Entity) {
    this._entities.set(entity.$id, entity);
  }

  /**
   *
   * @param id Entity name
   */
  removeEntity(id: string) {
    return this._entities.delete(id);
  }
}
