import { ECSBase } from "..";
import { Entity } from ".";
import { IEntitySchema } from "../schemas/types";
import { IComponentDefinition } from "types";

export interface IQuery {
  [key: string]: string
}

export class EntityCollection<C extends IComponentDefinition> {
  private _entities = new Map<string, Entity<C>>();

  constructor(private readonly _ecs: ECSBase<C>) {}

  add(schema: IEntitySchema) {
    const entity = new Entity<C>(schema, this._ecs.componentManager);
    this._entities.set(schema.entity, entity);
    this._ecs.pipeline.addEntity(entity);
    return entity;
  }

  remove(id: string) {
    const entity = this._entities.get(id);
    if ( entity ) {
      this._entities.delete(id);
      this._ecs.pipeline.removeEntity(entity, true);
      return true;
    }

    return false;
  }

  get(id: string) {
    return this._entities.get(id);
  }

  has(id: string) {
    return this._entities.has(id);
  }

  values() {
    return this._entities.values();
  }

  count() {
    return this._entities.size;
  }
}