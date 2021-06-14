import { IECSSchema } from "@/ecs/schemas";
import { IGeneratorInfo } from "../types";

export const generate = (_data: IECSSchema<string>): IGeneratorInfo => {
  return {
    imports: [{
      package: "@kryptonstudio/ecs",
      imports: ["kecs"]
    }],
    exports: [{
      exportName: "Client",
      localName: "Client"
    }],
    src: `
// Client Class /////////////////////////////////////////////////////////////////
class Client extends kecs.ECSBase {
  constructor() {
    super({ schema: componentSchema });
  }
}
`
  }
};
