import { ComponentFields, Component, ComponentInterface } from "./component";
import { Entity } from "./entity";

interface ITestComp1 extends ComponentInterface {
  fieldA: string
  fieldB: number
  fieldC: boolean
}

const testComp1: ComponentFields<ITestComp1> = {
  "fieldA": { defaultValue: "I am a string", type: "string" },
  "fieldB": { defaultValue: 123, type: "number" },
  "fieldC": { defaultValue: true, type: "boolean" }
}

describe("Entity", () => {

  it("Add/Remove Component", () => {
    let entity = new Entity();
    let comp1 = new Component("comp1", testComp1);

    entity.addComponent(comp1);
    expect(entity.listComponents()).toStrictEqual(["comp1"])

    entity.removeComponent("comp1");
    expect(entity.listComponents()).toStrictEqual([])
  })

});