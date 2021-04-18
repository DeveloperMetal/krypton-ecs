var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { SystemCollection } from "./systemCollection";
export class Pipeline {
    constructor(_ecs, _pipelineEntryFilter, _pipelineExitFilter) {
        this._ecs = _ecs;
        this._pipelineEntryFilter = _pipelineEntryFilter;
        this._pipelineExitFilter = _pipelineExitFilter;
        this.children = new Map();
        this._entities = new Set();
        this.systems = new SystemCollection(this._ecs, this);
    }
    get entityCount() {
        return this._entities.size;
    }
    get entities() {
        return this._entities.values();
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.systems.executeSystems();
            for (const child of this.children.values()) {
                child.addEntities(this._entities.values());
                child.execute();
            }
            if (this._pipelineExitFilter) {
                const exitEntities = this._pipelineExitFilter(this._ecs, this._entities.values());
                this._entities.clear();
                for (const entity of exitEntities) {
                    this._entities.add(entity);
                }
            }
        });
    }
    addEntities(entities) {
        let filteredEntities = entities;
        if (this._pipelineEntryFilter) {
            filteredEntities = this._pipelineEntryFilter(this._ecs, entities);
        }
        for (const entity of filteredEntities) {
            this._entities.add(entity);
        }
    }
    addEntity(entity) {
        this.addEntities([entity].values());
    }
    removeEntity(entity, recurively = false) {
        this._entities.delete(entity);
        if (recurively) {
            for (const child of this.children.values()) {
                child.removeEntity(entity);
            }
        }
    }
    flush(flushChildren = false) {
        this._entities.clear();
        if (flushChildren) {
            for (const child of this.children.values()) {
                child.flush(flushChildren);
            }
        }
    }
}
//# sourceMappingURL=pipeline.js.map