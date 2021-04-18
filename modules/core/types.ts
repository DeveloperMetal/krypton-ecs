import { IECSSchema } from "@kryptonstudio/ecs/schemas/types";

export interface ECSOpts {
  readonly name?: string
  readonly schema: IECSSchema,
  useTypeGuards?: boolean,
}