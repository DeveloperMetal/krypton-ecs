import { ComponentInterface, ComponentFields, ECSDefine } from '../types';
import { ECS } from '..';

interface ITestComp1 extends ComponentInterface {
  fieldA: string;
  fieldB: number;
  fieldC: boolean;
}

interface ITestComp2 extends ComponentInterface {
  fieldD: string;
}

const testComp1: ComponentFields<ITestComp1> = {
  fieldA: { defaultValue: 'I am a string', type: 'string' },
  fieldB: { defaultValue: 123, type: 'number' },
  fieldC: { defaultValue: true, type: 'boolean' },
};

const testComp2: ComponentFields<ITestComp2> = {
  fieldD: { type: 'string' },
};
interface ECSTest extends ECSDefine {
  ITestComp1: ITestComp1
}

interface ECSInvalidTest extends ECSDefine {
  ITEstComp2: ITestComp2
}

describe('Entity', () => {
  it('Add Entity', () => {
    const ecs = new ECS({
      ITestComp1: testComp1,
    });
    const entity = ecs.addEntity('test');
    const comp = entity.addComponent('ITestComp1');
    ecs.update();

    expect(ecs.entity('test') === entity).toBeTruthy();
    expect(comp?.parentEntity === entity || false).toBeTruthy();
    expect(comp?.keys()).toMatchObject(['fieldA', 'fieldB', 'fieldC']);
  });

  it('Add/Remove Component', () => {
    const ecs = new ECS({
      ITestComp1: testComp1,
    });
    const entity = ecs.addEntity('test');
    const comp1 = entity.addComponent<ECSTest, 'ITestComp1'>('ITestComp1');

    ecs.update();
    expect(comp1).toBeTruthy();
    expect(entity.listComponents()).toStrictEqual(['ITestComp1']);

    entity.removeComponent<ECSTest>('ITestComp1');
    ecs.update();

    expect(entity.listComponents()).toStrictEqual([]);
  });

  it('Invalid Component definition', () => {
    const ecs = new ECS({
      ITEstComp2: testComp2,
    });
    const entity = ecs.addEntity('test');
    expect(() => {
      entity.addComponent<ECSInvalidTest, 'ITEstComp2'>('ITEstComp2');
    }).toThrow('Default Value is required when field is not nullable');
  });

  it('Get component', () => {
    const ecs = new ECS({
      ITestComp1: testComp1,
    });
    const entity = ecs.addEntity('test');
    entity.addComponent('ITestComp1');
    const comp1 = entity.component<ECSTest, 'ITestComp1'>('ITestComp1');

    ecs.update();
    expect(comp1?.$id).toBe('ITestComp1');

    // Force a bad key call
    expect(() => {
      entity.component('bad-name')
    }).toThrowError();
  });

  it('Invalid types', () => {
    const ecs = new ECS({
      ITestComp1: testComp1,
    });
    const entity = ecs.addEntity('test');
    const comp1 = entity.addComponent<ECSTest, 'ITestComp1'>('ITestComp1');

    expect(comp1).toBeTruthy();

    if (comp1) {
      expect(() => Reflect.set(comp1, 'fieldA', null)).toThrowError('Invalid Type. Field is not nullable');
      expect(() => Reflect.set(comp1, 'fieldA', 1)).toThrowError('Invalid Type');
      expect(() => Reflect.set(comp1, 'invalidField', 1)).toThrowError('Field invalidField not found');
    }
  });

  it('Removing a component on an entity without such component', () => {
    const ecs = new ECS({
      ITestComp1: testComp1,
    });
    const entity = ecs.addEntity('test');
    // Try removing first to test non existing component cache branch
    entity.removeComponent('ITestComp1');
  });
});
