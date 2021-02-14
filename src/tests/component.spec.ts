import { ECS, IECSSchema } from "..";
import { Component } from "../data/component";
import { ComponentManager } from "../data/componentManager";
import { Entity } from "../data/entity";

interface ITestComponent extends Component{
  fieldA: string
  fieldB: number
  fieldC: boolean
  fieldD: object
  fieldE: Float32Array
  fieldF: Float32Array
}

interface IHaveTestComponent extends Entity {
  TestComponent: ITestComponent
}

describe("Components", () => {
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
          },
          fieldB: {
            type: "number",
            defaultValue: 1,
            allowNull: false,
          },
          fieldC: {
            type: "boolean",
            defaultValue: true,
            allowNull: false
          },
          fieldD: {
            type: "object",
            defaultValue: {},
            allowNull: false
          },
          fieldE: {
            type: "float32Array",
            defaultValue: new Float32Array(),
            allowNull: false
          },
          fieldF: {
            type: "float32Array",
            defaultValue: [],
            allowNull: false
          },
          fieldNull: {
            type: "number",
            defaultValue: null,
            allowNull: true
          }
        }
      }, {
        component: "BadNumberComponent",
        fields: {
          fielda: {
            type: "number",
            defaultValue: true,
            allowNull: false
          }
        }
      }, {
        component: "BadStringComponent",
        fields: {
          fielda: {
            type: "string",
            defaultValue: 123,
            allowNull: false
          }
        }
      }, {
        component: "BadBooleanComponent",
        fields: {
          fielda: {
            type: "boolean",
            defaultValue: 123,
            allowNull: false
          }
        }
      }, {
        component: "BadObjectComponent",
        fields: {
          fielda: {
            type: "object",
            defaultValue: 123,
            allowNull: false
          }
        }
      }, {
        component: "BadFloatArrayComponent",
        fields: {
          fielda: {
            type: "float32Array",
            defaultValue: 123,
            allowNull: false
          }
        }
      }, {
        component: "BadNullDefault",
        fields: {
          fielda: {
            type: "number",
            defaultValue: null,
            allowNull: false
          }
        }
      }
    ]
  }

  beforeEach(() => {
    testEcs = new ECS({
      name: "default",
      useTypeGuards: true,
      schema
    })
    testComponentManager = new ComponentManager(testEcs);
  });


  it("Defaults", () => {
    const entity = new Entity({
      entity: "testEntity",
      components: ["TestComponent"]
    }, testComponentManager).as<IHaveTestComponent>();

    expect(entity.TestComponent.fieldA).toBe("test value");
    expect(entity.TestComponent.fieldB).toBe(1);
    expect(entity.TestComponent.fieldC).toBe(true);
    expect(entity.TestComponent.fieldD).toStrictEqual({});
    expect(entity.TestComponent.fieldE).toHaveLength(0);
    expect(entity.TestComponent.fieldF).toHaveLength(0);
  });

  it("Set Fields", () => {
    const entity = new Entity({
      entity: "testEntity",
      components: ["TestComponent"]
    }, testComponentManager).as<IHaveTestComponent>();

    entity.TestComponent.fieldA = "some string";
    entity.TestComponent.fieldB = 2;
    entity.TestComponent.fieldC = false;
    entity.TestComponent.fieldD = { hi: "hi" };
    entity.TestComponent.fieldE = new Float32Array([1]);
    entity.TestComponent.fieldF = new Float32Array([1]);

    expect(entity.TestComponent.fieldA).toBe("some string");
    expect(entity.TestComponent.fieldB).toBe(2);
    expect(entity.TestComponent.fieldC).toBe(false);
    expect(entity.TestComponent.fieldD).toStrictEqual({ hi: "hi" });
    expect(entity.TestComponent.fieldE).toStrictEqual(new Float32Array([1]))
    expect(entity.TestComponent.fieldF).toStrictEqual(new Float32Array([1]))
  });

  it("Test nullables", () => {
    const entity = new Entity({
      entity: "testEntity",
      components: ["TestComponent"]
    }, testComponentManager).as<IHaveTestComponent>();

    expect(() => Reflect.set(entity.TestComponent, "fieldA", null)).toThrow();
  });

  it("Test invalid types", () => {
    const entity = new Entity({
      entity: "testEntity",
      components: ["TestComponent"]
    }, testComponentManager).as<IHaveTestComponent>();

    expect(() => Reflect.set(entity.TestComponent, "fieldA", 12)).toThrow();
    expect(() => Reflect.set(entity.TestComponent, "fieldB", "test")).toThrow();
    expect(() => Reflect.set(entity.TestComponent, "fieldC", "test")).toThrow();
    expect(() => Reflect.set(entity.TestComponent, "fieldB", true)).toThrow();
    expect(() => Reflect.set(entity.TestComponent, "fieldD", 12)).toThrow();
    expect(() => Reflect.set(entity.TestComponent, "fieldA", new Float32Array([1]))).toThrow();
  });

  it("Invalid field set", () => {
    const entity = new Entity({
      entity: "testEntity",
      components: ["TestComponent"]
    }, testComponentManager).as<IHaveTestComponent>();

    expect(() => Reflect.set(entity.TestComponent, "badField", 123)).toThrow();
  });

  it("Invalid field default vs type", () => {
    const makeSchema = (component: string) => ({
      entity: "testEntity",
      components: [component]
    });

    expect(() => new Entity(makeSchema("BadNumberComponent"), testComponentManager)).toThrow();
    expect(() => new Entity(makeSchema("BadStringComponent"), testComponentManager)).toThrow();
    expect(() => new Entity(makeSchema("BadBooleanComponent"), testComponentManager)).toThrow();
    expect(() => new Entity(makeSchema("BadObjectComponent"), testComponentManager)).toThrow();
    expect(() => new Entity(makeSchema("BadFloatArrayComponent"), testComponentManager)).toThrow();
    expect(() => new Entity(makeSchema("BadNullDefault"), testComponentManager)).toThrow();
  });

  it("Parent reference", () => {
    const entity = new Entity({
      entity: "testEntity",
      components: ["TestComponent"]
    }, testComponentManager);
    const component = entity.getComponent("TestComponent").as<ITestComponent>();

    expect(component.parentEntity == entity).toBeTruthy();
  })

})