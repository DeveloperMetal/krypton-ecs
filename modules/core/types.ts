import { IECSSchema } from "@modules/schemas/types";

export interface ECSOpts {
  readonly name?: string
  readonly schema: IECSSchema,
  useTypeGuards?: boolean,
}