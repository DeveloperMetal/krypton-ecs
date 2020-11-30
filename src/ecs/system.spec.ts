import { ECS } from '.';
import { ComponentInterface, ComponentFields, ECSDefine, FilterType } from './types';
import { Entity } from './entity';

interface ITestComp1 extends ComponentInterface {
  fieldA: string;
  fieldB: number;
  fieldC: boolean;
  fieldD: string | null;
}

const testComp1: ComponentFields<ITestComp1> = {
  fieldA: { defaultValue: 'I am a string', type: 'string' },
  fieldB: { defaultValue: 123, type: 'number' },
  fieldC: { defaultValue: true, type: 'boolean' },
  fieldD: { type: 'string', nullable: true },
};

interface ECSTest extends ECSDefine {
  components: {
    ITestComp1: ITestComp1
  }
}

describe('Setup System', () => {
  it('Add and remove a system', () => {
    const testEntityAddingSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for(const ent of entities) {
        expect(e.entity(ent.$id)).toBeFalsy();
      }
    });

    const testEntityAddedSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for(const ent of entities) {
        expect(e.entity(ent.$id)).toBeTruthy();
      }
    });

    const testEntityRemovingSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for(const ent of entities) {
        // not removed yet, should still exist in the system
        expect(e.entity(ent.$id)).toBeTruthy();
      }
    });

    const testEntityRemovedSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for(const ent of entities) {
        // should not exist in the system by now.
        expect(e.entity(ent.$id)).toBeFalsy();
      }
    });

    const testEntityModifiedSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for(const ent of entities) {
        expect(e.entity(ent.$id)).toBeTruthy();
      }
    });

    const testEntityModifingSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for(const ent of entities) {
        expect(e.entity(ent.$id)).toBeTruthy();
      }
    });

    const ecs = new ECS<ECSTest>({
      ITestComp1: testComp1
    });

    const testFilter = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e).toStrictEqual(ecs);
      expect(entities.length).toBeGreaterThan(0);
      return entities;
    });

    ecs
      // Define a filter to trigger a system when specific entities are added
      .addSystem(FilterType.Adding, testFilter, testEntityAddingSystem)
      .addSystem(FilterType.Added, testFilter, testEntityAddedSystem)

      // Define a filter to trigger a system when specific entities are removed
      .addSystem(FilterType.Removing, testFilter, testEntityRemovingSystem)
      .addSystem(FilterType.Removed, testFilter, testEntityRemovedSystem)

      // Define a filter to trigger a system when specific entities are modified
      .addSystem(FilterType.Modifying, testFilter, testEntityModifingSystem)
      .addSystem(FilterType.Modified, testFilter, testEntityModifiedSystem);
  
    
    // Test added system triggers
    const entity = ecs.addEntity('first');

    ecs.update();
    expect(testEntityAddingSystem).toHaveBeenCalledWith(ecs, [entity]);
    expect(testEntityAddedSystem).toHaveBeenCalledWith(ecs, [entity]);

    // Test modified system triggers
    const comp = ecs.addComponent(entity, "ITestComp1");
    comp.fieldA = 'test';
    comp.fieldB = 10;
    comp.fieldC = true;
    comp.fieldD = null;

    ecs.update();    
    expect(testEntityModifingSystem).toHaveBeenCalledWith(ecs, [entity]);
    expect(testEntityModifiedSystem).toHaveBeenCalledWith(ecs, [entity]);

    // Test removed system triggers
    ecs.removeEntity(entity.$id);
    ecs.update();

    expect(testEntityRemovingSystem).toHaveBeenCalledWith(ecs, [entity]);
    expect(testEntityRemovedSystem).toHaveBeenCalledWith(ecs, [entity]);

    ecs.update(); // make sure we flush update queues before testing if filters were called.

    expect(testEntityAddingSystem).toHaveBeenCalledTimes(1);
    expect(testEntityAddedSystem).toHaveBeenCalledTimes(1);
    expect(testEntityModifingSystem).toHaveBeenCalledTimes(1);
    expect(testEntityModifiedSystem).toHaveBeenCalledTimes(1);
    expect(testEntityRemovingSystem).toHaveBeenCalledTimes(1);
    expect(testEntityRemovedSystem).toHaveBeenCalledTimes(1);
    expect(testFilter).toHaveBeenCalledTimes(6);
  });
});
