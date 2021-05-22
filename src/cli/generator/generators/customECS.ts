import { IECSSchema } from "../../schema/types";

export const generate = (_data: IECSSchema) => `
/**
 * ECS Client
 **/
export interface ECSClient extends ECSBase<IComponents> {
  constructor(opts) {
    super(schema, opts);
  }
}`;
