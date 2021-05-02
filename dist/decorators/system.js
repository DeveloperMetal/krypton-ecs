import { globalECSCache } from "..";
import { EXEC_PER_FRAME } from "../contants";
export function makeECSSystem(system, filter, ecsName = "default", executionGroup = EXEC_PER_FRAME) {
    var _a;
    const ecs = globalECSCache.get(ecsName);
    if (ecs) {
        (_a = ecs.pipeline.children.get(executionGroup)) === null || _a === void 0 ? void 0 : _a.systems.add(system, filter);
    }
    else {
        throw new Error(`ECS does not exist: ${ecsName}`);
    }
}
//# sourceMappingURL=system.js.map