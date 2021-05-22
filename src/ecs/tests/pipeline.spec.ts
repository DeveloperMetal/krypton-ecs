import { mocked } from "ts-jest/utils";
import { ECS } from "..";
import { Entity } from "../data/entity";
import { Pipeline } from "../data/pipeline";
import { SystemCollection } from "../data/systemCollection";
import { IFilter } from "../types";
import { IEntitySchema } from "../schemas/types";

jest.mock('../index', () => ({
  ECS: jest.fn().mockImplementation(() => ({
    componentManager: {}
  }))
}));

const sysAdd = jest.fn();
const sysExec = jest.fn();

jest.mock('../data/systemCollection', () => ({
  SystemCollection: jest.fn().mockImplementation(() => ({
    add: sysAdd,
    executeSystems: sysExec
  }))
}));

jest.mock('../data/entity', () => ({
  Entity: jest.fn().mockImplementation(() => ({
    schema: {
      components: []
    }
  }))
}));


describe("Pipelines", () => {
  const ECSMocked = mocked(ECS, true);
  const SystemCollectionMocked = mocked(SystemCollection, true);
  const EntityMocked = mocked(Entity, true);
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
    SystemCollectionMocked.mockClear();
    EntityMocked.mockClear();
    sysAdd.mockClear();
    sysExec.mockClear();
  });

  it("Setup Pipeline no exit filter", () => {
    const pipeline = new Pipeline(ecs);
    const testEntity1 = new Entity({} as IEntitySchema<string>, ecs.componentManager);
    const testEntity2 = new Entity({} as IEntitySchema<string>, ecs.componentManager);
    const testEntity3 = new Entity({} as IEntitySchema<string>, ecs.componentManager);
    pipeline.addEntity(testEntity1);

    expect(pipeline.systems).toBeTruthy();
    expect(pipeline.entityCount).toBe(1);

    pipeline.addEntities([testEntity2, testEntity3].values());
    expect(pipeline.entityCount).toBe(3);

    for(const e of pipeline.entities) {
      expect(e).toBeTruthy();
    }
  });

  it("Setup Pipeline with enter filters", () => {
    const enterFilter: IFilter<{}, string> = jest.fn((_ecs, entities) => entities);
    const pipeline = new Pipeline(ecs, enterFilter);
    const testEntity1 = new Entity({} as IEntitySchema<string>, ecs.componentManager);
    pipeline.addEntity(testEntity1);

    expect(pipeline.systems).toBeTruthy();
    expect(enterFilter).toHaveBeenCalledTimes(1)
    expect(pipeline.entityCount).toBe(1);
  });

  it("Setup Pipeline with exit filters", async () => {
    const testEntity1 = new Entity({} as IEntitySchema<string>, ecs.componentManager);
    const testEntity2 = new Entity({} as IEntitySchema<string>, ecs.componentManager);
    const exitFilter: IFilter<{}, string> = jest.fn((_ecs, _entities) => [testEntity2].values());
    const pipeline = new Pipeline(ecs, undefined, exitFilter);
    pipeline.addEntity(testEntity1);
    pipeline.addEntity(testEntity2);

    expect(pipeline.entityCount).toBe(2);
    expect(pipeline.systems).toBeTruthy();
    await pipeline.execute();
    expect(sysExec).toBeCalledTimes(1);
    expect(exitFilter).toBeCalledTimes(1);
    expect(pipeline.entityCount).toBe(1);
  });

  it("Pipeline flow level 1 deep", async () => {
    const pipelineParent = new Pipeline(ecs);
    const pipelineChild = new Pipeline(ecs);
    pipelineParent.children.set("child", pipelineChild);

    expect(pipelineChild.entityCount).toBe(0);

    const testEntity1 = new Entity({} as IEntitySchema<string>, ecs.componentManager);
    pipelineParent.addEntity(testEntity1);
    await pipelineParent.execute();

    expect(sysExec).toBeCalledTimes(2);
    expect(pipelineChild.entityCount).toBe(1);
  })

  it("Pipeline remove entity", async () => {
    const pipeline = new Pipeline(ecs);

    const testEntity1 = new Entity({} as IEntitySchema<string>, ecs.componentManager);
    pipeline.addEntity(testEntity1);
    expect(pipeline.entityCount).toBe(1);
    pipeline.removeEntity(testEntity1);
    expect(pipeline.entityCount).toBe(0);
  })

  it("Pipeline remove entity recursive", async () => {
    const pipeline1 = new Pipeline(ecs);
    const pipeline2 = new Pipeline(ecs);
    pipeline1.children.set("child", pipeline2);

    const testEntity1 = new Entity({} as IEntitySchema<string>, ecs.componentManager);
    pipeline1.addEntity(testEntity1);
    pipeline2.addEntity(testEntity1);

    expect(pipeline1.entityCount).toBe(1);
    expect(pipeline2.entityCount).toBe(1);

    pipeline1.removeEntity(testEntity1, true);
    expect(pipeline1.entityCount).toBe(0);
    expect(pipeline2.entityCount).toBe(0);
  })

  it("Pipeline flush", async () => {
    const pipeline = new Pipeline(ecs);

    const testEntity1 = new Entity({} as IEntitySchema<string>, ecs.componentManager);
    pipeline.addEntity(testEntity1);
    expect(pipeline.entityCount).toBe(1);
    pipeline.flush();
    expect(pipeline.entityCount).toBe(0);
  })

  it("Pipeline flush recursive", async () => {
    const pipeline1 = new Pipeline(ecs);
    const pipeline2 = new Pipeline(ecs);
    pipeline1.children.set("child", pipeline2);

    const testEntity1 = new Entity({} as IEntitySchema<string>, ecs.componentManager);
    pipeline1.addEntity(testEntity1);
    pipeline2.addEntity(testEntity1);

    expect(pipeline1.entityCount).toBe(1);
    expect(pipeline2.entityCount).toBe(1);

    pipeline1.flush(true);
    expect(pipeline1.entityCount).toBe(0);
    expect(pipeline2.entityCount).toBe(0);
  })
});