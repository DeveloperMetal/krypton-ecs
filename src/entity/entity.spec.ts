import { IComponent, ComponentFields, ECSDefine, FieldTypeOf } from '../types';
import { ECS } from '..';

interface ITestComp1 extends IComponent {
  fieldA: string;
  fieldB: number;
  fieldC: boolean;
  fieldFloat32Array: Float32Array
}

interface ITestComp2 extends IComponent {
  fieldD: string;
}

const testComp1: ComponentFields<ITestComp1> = {
  fieldA: { defaultValue: 'I am a string', typeof: FieldTypeOf.string },
  fieldB: { defaultValue: 123, typeof: FieldTypeOf.number },
  fieldC: { defaultValue: true, typeof: FieldTypeOf.boolean },
  fieldFloat32Array: { defaultValue: new Float32Array(1), typeof: FieldTypeOf.float32Array }
};

const testComp2: ComponentFields<ITestComp2> = {
  fieldD: { typeof: FieldTypeOf.string },
};
interface ECSTest extends ECSDefine {
  ITestComp1: ITestComp1;
}

interface ECSInvalidTest extends ECSDefine {
  ITEstComp2: ITestComp2;
}

describe('Entity', () => {
  it('Add Entity', () => {
    const ecs = new ECS<ECSTest>({
      ITestComp1: testComp1,
    });
    const entity = ecs.addEntity('test');
    const comp = entity.add('ITestComp1');
    ecs.update();

    expect(ecs.entity('test') === entity).toBeTruthy();
    expect(comp?.parentEntity === entity || false).toBeTruthy();
    expect(comp?.keys()).toMatchObject(['fieldA', 'fieldB', 'fieldC', 'fieldFloat32Array']);
  });

  it('Add/Remove Component', () => {
    const ecs = new ECS<ECSTest>({
      ITestComp1: testComp1,
    });
    const entity = ecs.addEntity('test');
    const comp1 = entity.add('ITestComp1');

    ecs.update();
    expect(comp1).toBeTruthy();
    expect(entity.list()).toStrictEqual(['ITestComp1']);

    entity.remove('ITestComp1');
    ecs.update();

    expect(entity.list()).toStrictEqual([]);
  });

  it('Invalid Component definition', () => {
    const ecs = new ECS<ECSInvalidTest>({
      ITEstComp2: testComp2,
    });
    const entity = ecs.addEntity('test');
    expect(() => {
      entity.add('ITEstComp2');
    }).toThrow('Default Value is required when field is not nullable');
  });

  it('Get component', () => {
    const ecs = new ECS<ECSTest>({
      ITestComp1: testComp1,
    });
    const entity = ecs.addEntity('test');
    entity.add('ITestComp1');
    const comp1 = entity.get<'ITestComp1'>('ITestComp1');

    ecs.update();
    expect(comp1?.$id).toBe('ITestComp1');

    // Force a bad key call
    expect(() => {
      entity.get('bad-name');
    }).toThrowError();
  });

  it('Modify Component', () => {
    const ecs = new ECS<ECSTest>({
      ITestComp1: testComp1,
    });
    const entity = ecs.addEntity('test');
    entity.add('ITestComp1');
    const comp1 = entity.get<'ITestComp1'>('ITestComp1');
    comp1.fieldA = 'new value';
    expect(comp1.modifiedFields()).toEqual(['fieldA']);
    ecs.update();
    expect(comp1.modifiedFields().length).toBe(0);
  });

  it('Invalid types', () => {
    const ecs = new ECS<ECSTest>({
      ITestComp1: testComp1,
    });
    const entity = ecs.addEntity('test');
    const comp1 = entity.add('ITestComp1');

    expect(comp1).toBeTruthy();

    if (comp1) {
      expect(() => Reflect.set(comp1, 'fieldA', null)).toThrowError('Invalid Type. Field is not nullable');
      expect(() => Reflect.set(comp1, 'fieldA', 1)).toThrowError('Value is not a number');
      expect(() => Reflect.set(comp1, 'fieldA', true)).toThrowError('Value is not a boolean');
      expect(() => Reflect.set(comp1, 'fieldB', 'test')).toThrowError('Value is not a string');
      expect(() => Reflect.set(comp1, 'fieldFloat32Array', [])).toThrowError('Value is not a Float32Array');
      expect(() => Reflect.set(comp1, 'invalidField', 1)).toThrowError('Field invalidField not found');
    }
  });

  it('Removing a component on an entity without such component', () => {
    const ecs = new ECS<ECSTest>({
      ITestComp1: testComp1,
    });
    const entity = ecs.addEntity('test');
    // Try removing first to test non existing component cache branch
    entity.remove('ITestComp1');
  });
});
