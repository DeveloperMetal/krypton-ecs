var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class SystemCollection {
    constructor(ecs, pipeline) {
        this.ecs = ecs;
        this.pipeline = pipeline;
        this._filters = new Map();
    }
    executeSystems() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const [filter, systemSet] of this._filters.entries()) {
                let filteredEntities = this.pipeline.entities;
                if (filter) {
                    filteredEntities = filter(this.ecs, this.pipeline.entities);
                }
                for (const system of systemSet.values()) {
                    yield system(this.ecs, filteredEntities);
                }
            }
        });
    }
    add(system, filter) {
        if (!this._filters.has(filter)) {
            this._filters.set(filter, new Set());
        }
        const filterSystemMap = this._filters.get(filter);
        filterSystemMap.add(system);
    }
    removeByFilter(filter) {
        if (this._filters.has(filter)) {
            return this._filters.delete(filter);
        }
        return false;
    }
    removeSystem(system) {
        for (const systemSet of this._filters.values()) {
            if (systemSet.has(system)) {
                systemSet.delete(system);
            }
        }
    }
    hasFilter(filter) {
        return this._filters.has(filter);
    }
    hasSystem(system) {
        for (const systemSet of this._filters.values()) {
            if (systemSet.has(system)) {
                return true;
            }
        }
        return false;
    }
}
//# sourceMappingURL=systemCollection.js.map