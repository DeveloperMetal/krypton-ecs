var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EXEC_PER_FRAME } from './contants';
import { ComponentManager } from './data/componentManager';
import { EntityCollection } from './data/entityCollection';
import { Pipeline } from './data/pipeline';
export * from './schemas/types';
export * from './data/entity';
export const globalECSCache = new Map();
export class ECSBase {
    constructor(opts) {
        this.opts = opts;
        this.pipeline = new Pipeline(this);
        this.entities = new EntityCollection(this);
        this.componentManager = new ComponentManager(this);
        this.pipeline.children.set(EXEC_PER_FRAME, new Pipeline(this));
        globalECSCache.set(this.name, this);
    }
    get name() {
        return this.opts.name || "default";
    }
    get schema() {
        return this.opts.schema;
    }
    get systems() {
        const perFrame = this.pipeline.children.get(EXEC_PER_FRAME);
        return perFrame === null || perFrame === void 0 ? void 0 : perFrame.systems;
    }
    addComponent(schema) {
        this.schema.components.push(schema);
    }
    update(executionGroup = EXEC_PER_FRAME) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield ((_a = this.pipeline.children.get(executionGroup)) === null || _a === void 0 ? void 0 : _a.systems.executeSystems());
        });
    }
}
//# sourceMappingURL=ecs_base.js.map