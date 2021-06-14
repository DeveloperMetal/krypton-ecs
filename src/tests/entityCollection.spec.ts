import { mocked } from 'ts-jest/utils';
import { ECS } from "..";
import { ECSEntity } from "../data/entity";
import { EntityCollection } from '../data/entityCollection';

const mockPipelineAddEntity = jest.fn();
const mockPipelineRemoveEntity = jest.fn();

jest.mock('../index', () => ({
  ECS: jest.fn().mockImplementation(() => ({
    pipeline: {
      addEntity: mockPipelineAddEntity,
      removeEntity: mockPipelineRemoveEntity
    },
    componentManager: {

    }
  }))
}));

jest.mock('../data/entity', () => ({
  ECSEntity: jest.fn().mockImplementation(() => ({

  }))
}))

describe("Entity collection", () => {
  const ECSMocked = mocked(ECS, true);
  const EntityMocked = mocked(ECSEntity, true);
  const ecs = new ECS({
    schema: {
      components: [{
        component: "TestComponent",
        fields: {}
      }]
    },
    name: "default",
    useTypeGuards: true
  });

  beforeEach(() => {
    ECSMocked.mockClear();
    EntityMocked.mockClear();
    mockPipelineAddEntity.mockClear();
    mockPipelineRemoveEntity.mockClear();
  })

  it("Add and remove entity", () => {
    const collection = new EntityCollection(ecs);

    collection.add({
      entity: "testEntity",
      components: ["TestComponent"]
    });

    expect(EntityMocked).toHaveBeenCalledTimes(1);
    expect(mockPipelineAddEntity).toHaveBeenCalledTimes(1);
    expect(collection.get("testEntity")).toBeTruthy();

    // remove entity test
    expect(collection.remove("testEntity")).toBeTruthy();
    expect(collection.get("testEntity")).toBeFalsy();
    expect(mockPipelineRemoveEntity).toHaveBeenCalledTimes(1);
  });

  it("Remove missing entity", () => {
    const collection = new EntityCollection(ecs);
    expect(collection.remove("testEntity")).toBeFalsy();
  });

  it("Basic entity querying", () => {
    const collection = new EntityCollection(ecs);

    collection.add({entity: "testEntity1", components: ["TestComponent"]});
    collection.add({entity: "testEntity2", components: ["TestComponent"]});

    expect(collection.count()).toBe(2);

    expect(collection.has("testEntity1")).toBeTruthy();
    expect(collection.has("testEntity2")).toBeTruthy();
    expect(collection.has("testEntity3")).toBeFalsy();

    expect(collection.get("testEntity1")).toBeTruthy();
    expect(collection.get("testEntity2")).toBeTruthy();
    expect(collection.get("testEntity3")).toBeFalsy();

    expect(Array.from(collection.values())).toHaveLength(2);

  });

});