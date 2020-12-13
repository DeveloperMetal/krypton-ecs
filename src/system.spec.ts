import { ECS } from '.';
import { ComponentInterface, ComponentFields, ECSDefine, FilterType, System, FilterCallback } from './types';
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
  let ecs: ECS<ECSTest>;
  let testEntityAddingSystem: System<ECSTest>;
  let testEntityAddedSystem: System<ECSTest>;
  let testEntityRemovingSystem: System<ECSTest>;
  let testEntityRemovedSystem: System<ECSTest>;
  let testEntityModifiedSystem: System<ECSTest>;
  let testEntityModifingSystem: System<ECSTest>;
  let testFilter: FilterCallback<ECSTest>;
  let testFilter2: FilterCallback<ECSTest>;

  beforeEach(() => {
    testEntityAddingSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for(const ent of entities) {
        expect(e.entity(ent.$id)).toBeFalsy();
      }
    });

    testEntityAddedSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for(const ent of entities) {
        expect(e.entity(ent.$id)).toBeTruthy();
      }
    });

    testEntityRemovingSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for(const ent of entities) {
        // not removed yet, should still exist in the system
        expect(e.entity(ent.$id)).toBeTruthy();
      }
    });

    testEntityRemovedSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for(const ent of entities) {
        // should not exist in the system by now.
        expect(e.entity(ent.$id)).toBeFalsy();
      }
    });

    testEntityModifiedSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for(const ent of entities) {
        expect(e.entity(ent.$id)).toBeTruthy();
      }
    });

    testEntityModifingSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for(const ent of entities) {
        expect(e.entity(ent.$id)).toBeTruthy();
      }
    });

    ecs = new ECS<ECSTest>({
      ITestComp1: testComp1
    });

    testFilter = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e).toStrictEqual(ecs);
      expect(entities.length).toBeGreaterThan(0);
      return entities;
    });

    testFilter2 = jest.fn((_e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => entities);

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
  });

  it('Double add same system', () => {
    // Here to trigger branching path where filter type isn't added twice
    ecs.addSystem(FilterType.Adding, testFilter, testEntityAddingSystem);
    // Here to trigger branching path where filter type exists but callback doesn't
    ecs.addSystem(FilterType.Adding, testFilter2, testEntityAddingSystem);

    expect(ecs.systemExists(FilterType.Adding, testFilter, testEntityAddingSystem)).toBeTruthy();
    expect(ecs.systemExists(FilterType.Adding, testFilter2, testEntityAddingSystem)).toBeTruthy();
  });

  it('System event triggers', () => {
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
  })

  it('Add and remove systems', () => {
    ecs.update();
    expect(ecs.systemExists(FilterType.Adding, testFilter, testEntityAddingSystem)).toBeTruthy();
    expect(ecs.systemExists(FilterType.Added, testFilter, testEntityAddedSystem)).toBeTruthy();
    expect(ecs.systemExists(FilterType.Removing, testFilter, testEntityRemovingSystem)).toBeTruthy();
    expect(ecs.systemExists(FilterType.Removed, testFilter, testEntityRemovedSystem)).toBeTruthy();
    expect(ecs.systemExists(FilterType.Modifying, testFilter, testEntityModifingSystem)).toBeTruthy();
    expect(ecs.systemExists(FilterType.Modified, testFilter, testEntityModifiedSystem)).toBeTruthy();

    const testEntityAddingSystemRemoved = ecs.removeSystem(FilterType.Adding, testFilter, testEntityAddingSystem);
    const testEntityAddedSystemRemoved = ecs.removeSystem(FilterType.Added, testFilter, testEntityAddedSystem);
    const testEntityRemovingSystemRemoved = ecs.removeSystem(FilterType.Removing, testFilter, testEntityRemovingSystem);
    const testEntityRemovedSystemRemoved = ecs.removeSystem(FilterType.Removed, testFilter, testEntityRemovedSystem);
    const testEntityModifingSystemRemoved = ecs.removeSystem(FilterType.Modifying, testFilter, testEntityModifingSystem);
    const testEntityModifiedSystemRemoved = ecs.removeSystem(FilterType.Modified, testFilter, testEntityModifiedSystem);

    expect(testEntityAddingSystemRemoved).toBeTruthy();
    expect(testEntityAddedSystemRemoved).toBeTruthy();
    expect(testEntityRemovingSystemRemoved).toBeTruthy();
    expect(testEntityRemovedSystemRemoved).toBeTruthy();
    expect(testEntityModifingSystemRemoved).toBeTruthy();
    expect(testEntityModifiedSystemRemoved).toBeTruthy();

    expect(ecs.systemExists(FilterType.Adding, testFilter, testEntityAddingSystem)).toBeFalsy();
    expect(ecs.systemExists(FilterType.Added, testFilter, testEntityAddedSystem)).toBeFalsy();
    expect(ecs.systemExists(FilterType.Removing, testFilter, testEntityRemovingSystem)).toBeFalsy();
    expect(ecs.systemExists(FilterType.Removed, testFilter, testEntityRemovedSystem)).toBeFalsy();
    expect(ecs.systemExists(FilterType.Modifying, testFilter, testEntityModifingSystem)).toBeFalsy();
    expect(ecs.systemExists(FilterType.Modified, testFilter, testEntityModifiedSystem)).toBeFalsy();
  });

  it('Remove system by types', () => {
    expect(ecs.removeSystemsByFilter(FilterType.Adding, testFilter)).toBeTruthy();
    expect(ecs.removeSystemsByFilter(FilterType.Added, testFilter)).toBeTruthy();
    expect(ecs.removeSystemsByFilter(FilterType.Removing, testFilter)).toBeTruthy();
    expect(ecs.removeSystemsByFilter(FilterType.Removed, testFilter)).toBeTruthy();
    expect(ecs.removeSystemsByFilter(FilterType.Modifying, testFilter)).toBeTruthy();
    expect(ecs.removeSystemsByFilter(FilterType.Modified, testFilter)).toBeTruthy();

    expect(ecs.systemExists(FilterType.Adding, testFilter, testEntityAddingSystem)).toBeFalsy();
    expect(ecs.systemExists(FilterType.Added, testFilter, testEntityAddedSystem)).toBeFalsy();
    expect(ecs.systemExists(FilterType.Removing, testFilter, testEntityRemovingSystem)).toBeFalsy();
    expect(ecs.systemExists(FilterType.Removed, testFilter, testEntityRemovedSystem)).toBeFalsy();
    expect(ecs.systemExists(FilterType.Modifying, testFilter, testEntityModifingSystem)).toBeFalsy();
    expect(ecs.systemExists(FilterType.Modified, testFilter, testEntityModifiedSystem)).toBeFalsy();
  });
});

describe("Empty ECS Test", () => {
  let ecs: ECS<ECSTest>;
  let testFilter: FilterCallback<ECSTest>;
  let testFilter2: FilterCallback<ECSTest>;
  let emptySystem: System<ECSTest>;
  let emptySystem2: System<ECSTest>;
  
  beforeEach(() => {
    testFilter = (_e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => entities;
    emptySystem = (_e: ECS<ECSTest>, _entities: Entity<ECSTest>[]) => {};
    emptySystem2 = (_e: ECS<ECSTest>, _entities: Entity<ECSTest>[]) => {};

    ecs = new ECS<ECSTest>({
      ITestComp1: testComp1
    });
  });
  
  it("Removing non existing systems", () => {
    // Test remoging non existing system in non existing filter in non exising filter type event.
    expect(ecs.removeSystem(FilterType.Added, testFilter, emptySystem)).toBeFalsy();

    // Test removing missing filter from existing filter type event
    ecs.addSystem(FilterType.Added, testFilter, emptySystem)
    expect(ecs.removeSystem(FilterType.Added, testFilter2, emptySystem)).toBeFalsy();
  });

  it("Removing non existing systems by filters", () => {
    expect(ecs.removeSystemsByFilter(FilterType.Added, testFilter)).toBeFalsy();

    // Test removing missing filter from existing filter type event
    ecs.addSystem(FilterType.Added, testFilter, emptySystem)
    expect(ecs.removeSystemsByFilter(FilterType.Added, testFilter2)).toBeFalsy();
  })

  it("Checking non existing systems", () => {

    expect(ecs.systemExists(FilterType.Added, testFilter, emptySystem)).toBeFalsy();

    // Test removing missing filter from existing filter type event
    ecs.addSystem(FilterType.Added, testFilter, emptySystem)
    expect(ecs.systemExists(FilterType.Added, testFilter, emptySystem2)).toBeFalsy();
    expect(ecs.systemExists(FilterType.Added, testFilter2, emptySystem2)).toBeFalsy();
  });
});