import { mocked } from 'ts-jest/utils';
import { ECS } from "..";
import { SystemCollection } from '../data';
import { Pipeline } from "../data/pipeline";
import { IFilter, ISystem } from '../types';

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

jest.mock('../data/pipeline', () => ({
  Pipeline: jest.fn().mockImplementation(() => ({
    get entities() { return [].values(); },
    addEntity: mockPipelineAddEntity,
    removeEntity: mockPipelineRemoveEntity,
}))
}))

describe("System Collection", () => {
  const ECSMocked = mocked(ECS, true);
  const PipelineMocked = mocked(ECS, true);
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
    PipelineMocked.mockClear();
    mockPipelineAddEntity.mockClear();
    mockPipelineRemoveEntity.mockClear();
  });

  it("Add and remove system", () => {
    const collection = new SystemCollection(ecs, new Pipeline(ecs));
    const testSystem: ISystem<{}, string> = jest.fn();

    collection.add(testSystem);
    expect(collection.hasSystem(testSystem)).toBeTruthy();

    collection.removeSystem(testSystem);
    expect(collection.hasSystem(testSystem)).toBeFalsy();

    // Extra call to complete coverage
    collection.removeSystem(testSystem);
  });

  it("Execute systems", async () => {
    const collection = new SystemCollection(ecs, new Pipeline(ecs));
    const testSystem1: ISystem<{}, string> = jest.fn();
    const testSystem2: ISystem<{}, string> = jest.fn();

    collection.add(testSystem1);
    collection.add(testSystem2);

    await collection.executeSystems();

    expect(testSystem1).toHaveBeenCalledWith(ecs, collection.pipeline.entities);
    expect(testSystem2).toHaveBeenCalledWith(ecs, collection.pipeline.entities);
  });

  it("Execute systems with filter", async () => {
    const collection = new SystemCollection(ecs, new Pipeline(ecs));
    const testSystem: ISystem<{}, string> = jest.fn();
    const testFilter: IFilter<{}, string> = jest.fn((_ecs, entities) => entities);

    collection.add(testSystem, testFilter);

    await collection.executeSystems();

    expect(testFilter).toHaveBeenCalledWith(ecs, collection.pipeline.entities);
    expect(testSystem).toHaveBeenCalledWith(ecs, collection.pipeline.entities);
  });

  it("Add/Remove systems by filter", async () => {
    const collection = new SystemCollection(ecs, new Pipeline(ecs));
    const testSystem: ISystem<{}, string> = jest.fn();
    const testFilter: IFilter<{}, string> = jest.fn((_ecs, entities) => entities);

    collection.add(testSystem, testFilter);
    expect(collection.hasSystem(testSystem)).toBeTruthy();
    expect(collection.hasFilter(testFilter)).toBeTruthy();

    expect(collection.removeByFilter(testFilter)).toBeTruthy()
    expect(collection.hasSystem(testSystem)).toBeFalsy();
    expect(collection.hasFilter(testFilter)).toBeFalsy();

    expect(collection.removeByFilter(testFilter)).toBeFalsy();

  });

  it("Add multiple systems on one filter", async () => {
    const collection = new SystemCollection(ecs, new Pipeline(ecs));
    const testSystem1: ISystem<{}, string> = jest.fn();
    const testSystem2: ISystem<{}, string> = jest.fn();
    const testFilter: IFilter<{}, string> = jest.fn((_ecs, entities) => entities);

    collection.add(testSystem1, testFilter);
    collection.add(testSystem2, testFilter);
    expect(collection.hasSystem(testSystem1)).toBeTruthy();
    expect(collection.hasSystem(testSystem2)).toBeTruthy();
    expect(collection.hasFilter(testFilter)).toBeTruthy();

    await collection.executeSystems();

    expect(testFilter).toHaveBeenCalledTimes(1);
    expect(testSystem1).toHaveBeenCalledWith(ecs, collection.pipeline.entities);
    expect(testSystem2).toHaveBeenCalledWith(ecs, collection.pipeline.entities);
  });

});