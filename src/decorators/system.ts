import { globalECSCache } from "..";
import { EXEC_PER_FRAME } from "../contants";
import { IFilter, ISystem } from "../data/types";

export function makeSystem(system: ISystem, filter: IFilter, ecsName: string = "default", executionGroup: string = EXEC_PER_FRAME) {
  const ecs = globalECSCache.get(ecsName);
  if ( ecs ) {
    ecs.execGroup.children.get(executionGroup)?.systems.add(system, filter);
  } else {
    throw new Error(`ECS does not exist: ${ecsName}`);
  }
}