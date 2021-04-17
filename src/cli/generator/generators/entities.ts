import { IECSSchema } from "../../../schema/types";
import { reduce } from "../utils";

export const generate = (data: IECSSchema) => `
/**
 * Initializes ECS framework
 */
export default function (ecs: ECS<IDefine>) {
  // Initializes all entities ////////////////////////////////////////
${reduce((data.entities || []), (entity) => entity.components.length > 0 ? `
  ecs.entity("${entity.entity}", "${entity.components.join('", "')}")
`: `
  ecs.entity("${entity.entity}")
`)}
}`;