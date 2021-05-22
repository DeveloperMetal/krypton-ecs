import { IComponents } from "../schemas";
import { IDefinitions } from "../types";
import { ECSBase, globalECSCache } from "..";
import { EXEC_PER_FRAME } from "../contants";
import { IFilter, ISystem } from "../types";

export function makeECSSystem<D extends IDefinitions, C extends IComponents>(system: ISystem<D, C>, filter: IFilter<D, C>, ecsName: string = "default", executionGroup: string = EXEC_PER_FRAME) {
  const ecs = globalECSCache.get(ecsName) as ECSBase<D, C>;
  if ( ecs ) {
    ecs.pipeline.children.get(executionGroup)?.systems.add(system, filter);
  } else {
    throw new Error(`ECS does not exist: ${ecsName}`);
  }
}