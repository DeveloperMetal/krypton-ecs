import { globalECSCache } from "@kryptonstudio/ecs/core";
import { EXEC_PER_FRAME } from "@kryptonstudio/ecs/constants";
import { IFilter, ISystem } from "@kryptonstudio/ecs/data/types";

export function makeSystem(system: ISystem, filter: IFilter, ecsName: string = "default", executionGroup: string = EXEC_PER_FRAME) {
  const ecs = globalECSCache.get(ecsName);
  if ( ecs ) {
    ecs.pipeline.children.get(executionGroup)?.systems.add(system, filter);
  } else {
    throw new Error(`ECS does not exist: ${ecsName}`);
  }
}