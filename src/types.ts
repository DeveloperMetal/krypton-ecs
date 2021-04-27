import { IECSSchema } from "./schemas/types";

export interface ECSOpts {
  readonly name?: string
  readonly schema: IECSSchema,
  useTypeGuards?: boolean,
}

export interface IComponentDefinition {
  [name: string]: any
}