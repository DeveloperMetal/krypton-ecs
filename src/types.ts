import { IECSSchema } from "./schema/types";

export interface ECSOpts {
  readonly name?: string
  readonly schema: IECSSchema,
  useTypeGuards?: boolean,
}