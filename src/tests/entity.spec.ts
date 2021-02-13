import { ECS } from "..";
import { ComponentManager } from "../data/componentManager";
import { Entity } from "../data/entity";
import { IECSSchema } from "../schema/types";

describe("Entity", () => {
  let testComponentManager: ComponentManager;
  let testEcs: ECS;
  const schema: IECSSchema = {
    components: [
      {
        component: "TestComponent1",
        fields: {
          fieldA: {
            type: "string",
            defaultValue: "test value",
            allowNull: false
          }
        }
      }
    ]
  } 

  beforeEach(() => {
    testEcs = new ECS({
      name: "default",
      schema
    })
    testComponentManager = new ComponentManager(testEcs);
  })

  it("Define Entity", () => {
    const entity = new Entity({
      entity: "test-entity",
      components: ["TestComponent"]
    }, testComponentManager);
  });
})