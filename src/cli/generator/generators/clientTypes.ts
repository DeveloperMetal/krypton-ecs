import { IECSSchema } from "@/ecs/schemas";
import { IGeneratorInfo } from "../types";

export const generate = (_: IECSSchema<string>): IGeneratorInfo => ({
  imports: [{ 'package': '@kryptonstuio/ecs',
      'imports': ['ECSBase', 'IEntitySchema', 'ECSEntity'] }
  ],
  src: `
export declare class Client extends ECSBase<IClientComponents, IClientComponentNames> {
  constructor()
}
`});
