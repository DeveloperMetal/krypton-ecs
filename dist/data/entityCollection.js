import { Entity } from ".";
export class EntityCollection {
    constructor(_ecs) {
        this._ecs = _ecs;
        this._entities = new Map();
    }
    add(schema) {
        const entity = new Entity(schema, this._ecs.componentManager);
        this._entities.set(schema.entity, entity);
        this._ecs.pipeline.addEntity(entity);
        return entity;
    }
    remove(id) {
        const entity = this._entities.get(id);
        if (entity) {
            this._entities.delete(id);
            this._ecs.pipeline.removeEntity(entity, true);
            return true;
        }
        return false;
    }
    get(id) {
        return this._entities.get(id);
    }
    has(id) {
        return this._entities.has(id);
    }
    values() {
        return this._entities.values();
    }
    count() {
        return this._entities.size;
    }
}
//# sourceMappingURL=entityCollection.js.map