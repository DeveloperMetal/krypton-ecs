import { SystemCollection } from "data/systemCollection";
import { mocked } from "ts-jest/utils";
import { ECS, Entity } from "..";

jest.mock('../index', () => ({
  ECS: jest.fn().mockImplementation(() => ({ componentManager: {} }))
}));

jest.mock('../data/systemCollection', () => ({
  SystemCollection: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../data/entity', () => ({
  Entity: jest.fn().mockImplementation(() => ({
    schema: {
      components: []
    }
  }))
}));

const schema = {
  components: [{
    component: "Component1",
    fields: {}
  }]
}


describe("ECS", () => {
  const ECSMocked = mocked(ECS, true);
  const SystemCollectionMocked = mocked(SystemCollection, true);
  const EntityMocked = mocked(Entity, true);
  let ecs: ECS;

  beforeEach(() => {
    ECSMocked.mockClear();
    SystemCollectionMocked.mockClear();
    EntityMocked.mockClear();

    ecs = new ECS({
      name: "testECS",
      schema
    });
  })

  it("ECS Name", () => {
    expect(ecs.name).toBe("testECS");
  });

  it("Schema check", () => {
    expect(ecs.schema).toStrictEqual(schema);
  });

  it("Get per frame systems", () => {
    expect(ecs.systems).toBeTruthy()
  });

});