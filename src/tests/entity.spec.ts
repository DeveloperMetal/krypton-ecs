import { ECS } from "..";
import { ComponentManager } from "../data/componentManager";
import { Entity } from "../data/entity";
import { IECSSchema } from "../schema/types";

interface ITestComponent {
  fieldA: string
}

interface IHaveTestComponent {
  TestComponent: ITestComponent
}

describe("Entity", () => {
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
      }, {
        component: "TestComponent2",
        fields: {
          fieldB: {
            type: "number",
            defaultValue: 42,
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

    expect(entity.hasComponent("TestComponent")).toBeTruthy();
    expect(entity.hasComponent("Missing Component")).toBeFalsy();
    expect(entity.getComponent("TestComponent")).toBeTruthy();
    expect(() => entity.getComponent("MissingComponent")).toThrowError();
  });

  it("Guard entity from component injection", () => {
    const entity = new Entity({
      entity: "test-entity",
      components: ["TestComponent"]
    }, testComponentManager);

    expect(() => Reflect.set(entity, "injectComponent", {})).toThrowError();
  });

  it("List components", () => {
    const entity = new Entity({
      entity: "test-entity",
      components: ["TestComponent", "TestComponent2"],
    }, testComponentManager);

    expect(entity.listComponents()).toContain("TestComponent");
    expect(entity.listComponents()).toContain("TestComponent2");
  })

  it("Casting", () => {
    const entity = new Entity({
      entity: "test-entity",
      components: ["TestComponent"],
    }, testComponentManager).as<IHaveTestComponent>();

    expect(entity.TestComponent).toBeTruthy();
    expect(entity.TestComponent.fieldA).toBe("test value");

  });
})