import { ECSBase } from "..";
import { ECSEntity } from ".";
import { IComponents, IEntitySchema } from "../schemas/types";
import { IDefinitions } from "../types";

export interface IQuery {
  [key: string]: string
}

export class EntityCollection<D extends IDefinitions, C extends IComponents> {
  private _entities = new Map<string, ECSEntity<D, C>>();

  constructor(private readonly _ecs: ECSBase<D, C>) {}

  add(schema: IEntitySchema<C> | ECSEntity<D, C>) {
    if ( schema instanceof ECSEntity ) {
      this._entities.set(schema.schema.entity, schema);
      this._ecs.pipeline.addEntity(schema);
      return schema;
    } else {
      const entity = new ECSEntity<D, C>(schema as unknown as IEntitySchema<C>, this._ecs.componentManager);
      this._entities.set(schema.entity, entity);
      this._ecs.pipeline.addEntity(entity);
      return entity;
    }
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