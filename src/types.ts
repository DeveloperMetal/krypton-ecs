import { IECSSchema } from "./schema/types";

export interface ECSOpts {
  useTypeGuards?: boolean,
  schema: IECSSchema,
  name: string
}