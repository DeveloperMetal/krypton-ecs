import { ECS, Entity, IECSSchema } from "..";
import { ComponentManager } from "../data/componentManager";


describe("Component Manager", () => {
  let testComponentManager: ComponentManager;
  let testEcs: ECS;
  const schema: IECSSchema = {
    components: [
      {
        component: "TestComponent",
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

  it("Instantiate Component", () => {
    const testEntity = {} as Entity;

    const component = testComponentManager.newComponentInstance("TestComponent", testEntity);
    expect(component).toBeTruthy();
    expect(component.$id).toBe("TestComponent");
    expect(component._schema).toBe(testEcs.schema.components[0])
    expect(() => testComponentManager.newComponentInstance("MissingComponent", testEntity)).toThrow();
  })
});