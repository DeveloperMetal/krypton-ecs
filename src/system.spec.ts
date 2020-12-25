import { ECS } from '.';
import { IComponent, ComponentFields, ECSDefine, SystemEvent, System, FilterCallback, FieldTypeOf } from './types';
import { Entity } from './entity';

interface ITestComp1 extends IComponent {
  fieldA: string;
  fieldB: number;
  fieldC: boolean;
  fieldD: string | null;
}

const testComp1: ComponentFields<ITestComp1> = {
  fieldA: { defaultValue: 'I am a string', typeof: FieldTypeOf.string },
  fieldB: { defaultValue: 123, typeof: FieldTypeOf.number },
  fieldC: { defaultValue: true, typeof: FieldTypeOf.boolean },
  fieldD: { typeof: FieldTypeOf.string, nullable: true },
};

interface ECSTest extends ECSDefine {
  ITestComp1: ITestComp1;
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
      for (const ent of entities) {
        expect(e.entityExists(ent.$id)).toBeFalsy();
        expect(() => e.entity(ent.$id)).toThrowError();
      }
    });

    testEntityAddedSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for (const ent of entities) {
        expect(e.entity(ent.$id)).toBeTruthy();
      }
    });

    testEntityRemovingSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for (const ent of entities) {
        // not removed yet, should still exist in the system
        expect(e.entity(ent.$id)).toBeTruthy();
      }
    });

    testEntityRemovedSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for (const ent of entities) {
        // should not exist in the system by now.
        expect(e.entityExists(ent.$id)).toBeFalsy();
        expect(() => e.entity(ent.$id)).toThrowError();
      }
    });

    testEntityModifiedSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for (const ent of entities) {
        expect(e.entity(ent.$id)).toBeTruthy();
      }
    });

    testEntityModifingSystem = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e === ecs).toBeTruthy();
      for (const ent of entities) {
        expect(e.entity(ent.$id)).toBeTruthy();
      }
    });

    ecs = new ECS({
      ITestComp1: testComp1,
    });

    testFilter = jest.fn((e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => {
      expect(e).toStrictEqual(ecs);
      expect(entities.length).toBeGreaterThan(0);
      return entities;
    });

    testFilter2 = jest.fn((_e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => entities);

    ecs
      // Define a filter to trigger a system when specific entities are added
      .addSystem(SystemEvent.Adding, testFilter, testEntityAddingSystem)
      .addSystem(SystemEvent.Added, testFilter, testEntityAddedSystem)

      // Define a filter to trigger a system when specific entities are removed
      .addSystem(SystemEvent.Removing, testFilter, testEntityRemovingSystem)
      .addSystem(SystemEvent.Removed, testFilter, testEntityRemovedSystem)

      // Define a filter to trigger a system when specific entities are modified
      .addSystem(SystemEvent.Modifying, testFilter, testEntityModifingSystem)
      .addSystem(SystemEvent.Modified, testFilter, testEntityModifiedSystem);
  });

  it('Double add same system', () => {
    // Here to trigger branching path where system event isn't added twice
    ecs.addSystem(SystemEvent.Adding, testFilter, testEntityAddingSystem);
    // Here to trigger branching path where system event exists but callback doesn't
    ecs.addSystem(SystemEvent.Adding, testFilter2, testEntityAddingSystem);

    expect(ecs.systemExists(SystemEvent.Adding, testFilter, testEntityAddingSystem)).toBeTruthy();
    expect(ecs.systemExists(SystemEvent.Adding, testFilter2, testEntityAddingSystem)).toBeTruthy();
  });

  it('System event triggers', () => {
    // Test added system triggers
    const entity = ecs.addEntity('first');

    ecs.update();
    expect(testEntityAddingSystem).toHaveBeenCalledWith(ecs, [entity]);
    expect(testEntityAddedSystem).toHaveBeenCalledWith(ecs, [entity]);

    // Test modified system triggers
    const comp = entity.add('ITestComp1');
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

  it('Add and remove systems', () => {
    ecs.update();
    expect(ecs.systemExists(SystemEvent.Adding, testFilter, testEntityAddingSystem)).toBeTruthy();
    expect(ecs.systemExists(SystemEvent.Added, testFilter, testEntityAddedSystem)).toBeTruthy();
    expect(ecs.systemExists(SystemEvent.Removing, testFilter, testEntityRemovingSystem)).toBeTruthy();
    expect(ecs.systemExists(SystemEvent.Removed, testFilter, testEntityRemovedSystem)).toBeTruthy();
    expect(ecs.systemExists(SystemEvent.Modifying, testFilter, testEntityModifingSystem)).toBeTruthy();
    expect(ecs.systemExists(SystemEvent.Modified, testFilter, testEntityModifiedSystem)).toBeTruthy();

    const testEntityAddingSystemRemoved = ecs.removeSystem(SystemEvent.Adding, testFilter, testEntityAddingSystem);
    const testEntityAddedSystemRemoved = ecs.removeSystem(SystemEvent.Added, testFilter, testEntityAddedSystem);
    const testEntityRemovingSystemRemoved = ecs.removeSystem(
      SystemEvent.Removing,
      testFilter,
      testEntityRemovingSystem,
    );
    const testEntityRemovedSystemRemoved = ecs.removeSystem(SystemEvent.Removed, testFilter, testEntityRemovedSystem);
    const testEntityModifingSystemRemoved = ecs.removeSystem(
      SystemEvent.Modifying,
      testFilter,
      testEntityModifingSystem,
    );
    const testEntityModifiedSystemRemoved = ecs.removeSystem(
      SystemEvent.Modified,
      testFilter,
      testEntityModifiedSystem,
    );

    expect(testEntityAddingSystemRemoved).toBeTruthy();
    expect(testEntityAddedSystemRemoved).toBeTruthy();
    expect(testEntityRemovingSystemRemoved).toBeTruthy();
    expect(testEntityRemovedSystemRemoved).toBeTruthy();
    expect(testEntityModifingSystemRemoved).toBeTruthy();
    expect(testEntityModifiedSystemRemoved).toBeTruthy();

    expect(ecs.systemExists(SystemEvent.Adding, testFilter, testEntityAddingSystem)).toBeFalsy();
    expect(ecs.systemExists(SystemEvent.Added, testFilter, testEntityAddedSystem)).toBeFalsy();
    expect(ecs.systemExists(SystemEvent.Removing, testFilter, testEntityRemovingSystem)).toBeFalsy();
    expect(ecs.systemExists(SystemEvent.Removed, testFilter, testEntityRemovedSystem)).toBeFalsy();
    expect(ecs.systemExists(SystemEvent.Modifying, testFilter, testEntityModifingSystem)).toBeFalsy();
    expect(ecs.systemExists(SystemEvent.Modified, testFilter, testEntityModifiedSystem)).toBeFalsy();
  });

  it('Remove system by types', () => {
    expect(ecs.removeSystemsByFilter(SystemEvent.Adding, testFilter)).toBeTruthy();
    expect(ecs.removeSystemsByFilter(SystemEvent.Added, testFilter)).toBeTruthy();
    expect(ecs.removeSystemsByFilter(SystemEvent.Removing, testFilter)).toBeTruthy();
    expect(ecs.removeSystemsByFilter(SystemEvent.Removed, testFilter)).toBeTruthy();
    expect(ecs.removeSystemsByFilter(SystemEvent.Modifying, testFilter)).toBeTruthy();
    expect(ecs.removeSystemsByFilter(SystemEvent.Modified, testFilter)).toBeTruthy();

    expect(ecs.systemExists(SystemEvent.Adding, testFilter, testEntityAddingSystem)).toBeFalsy();
    expect(ecs.systemExists(SystemEvent.Added, testFilter, testEntityAddedSystem)).toBeFalsy();
    expect(ecs.systemExists(SystemEvent.Removing, testFilter, testEntityRemovingSystem)).toBeFalsy();
    expect(ecs.systemExists(SystemEvent.Removed, testFilter, testEntityRemovedSystem)).toBeFalsy();
    expect(ecs.systemExists(SystemEvent.Modifying, testFilter, testEntityModifingSystem)).toBeFalsy();
    expect(ecs.systemExists(SystemEvent.Modified, testFilter, testEntityModifiedSystem)).toBeFalsy();
  });
});

describe('Empty ECS Test', () => {
  /* tslint:disable:prefer-const */
  let ecs: ECS<ECSTest>;
  /* tslint:disable:prefer-const */
  let testFilter: FilterCallback<ECSTest>;
  /* tslint:disable:prefer-const */
  let testFilter2: FilterCallback<ECSTest>;
  /* tslint:disable:prefer-const */
  let emptySystem: System<ECSTest>;
  /* tslint:disable:prefer-const */
  let emptySystem2: System<ECSTest>;

  beforeEach(() => {
    testFilter = (_e: ECS<ECSTest>, entities: Entity<ECSTest>[]) => entities;
    /* tslint:disable:no-empty */
    emptySystem = (_e: ECS<ECSTest>, _entities: Entity<ECSTest>[]) => {};
    /* tslint:disable:no-empty */
    emptySystem2 = (_e: ECS<ECSTest>, _entities: Entity<ECSTest>[]) => {};

    ecs = new ECS({
      ITestComp1: testComp1,
    });
  });

  it('Removing non existing systems', () => {
    // Test remoging non existing system in non existing filter in non exising system event event.
    expect(ecs.removeSystem(SystemEvent.Added, testFilter, emptySystem)).toBeFalsy();

    // Test removing missing filter from existing system event event
    ecs.addSystem(SystemEvent.Added, testFilter, emptySystem);
    expect(ecs.removeSystem(SystemEvent.Added, testFilter2, emptySystem)).toBeFalsy();
  });

  it('Removing non existing systems by filters', () => {
    expect(ecs.removeSystemsByFilter(SystemEvent.Added, testFilter)).toBeFalsy();

    // Test removing missing filter from existing system event event
    ecs.addSystem(SystemEvent.Added, testFilter, emptySystem);
    expect(ecs.removeSystemsByFilter(SystemEvent.Added, testFilter2)).toBeFalsy();
  });

  it('Checking non existing systems', () => {
    expect(ecs.systemExists(SystemEvent.Added, testFilter, emptySystem)).toBeFalsy();

    // Test removing missing filter from existing system event event
    ecs.addSystem(SystemEvent.Added, testFilter, emptySystem);
    expect(ecs.systemExists(SystemEvent.Added, testFilter, emptySystem2)).toBeFalsy();
    expect(ecs.systemExists(SystemEvent.Added, testFilter2, emptySystem2)).toBeFalsy();
  });
});
