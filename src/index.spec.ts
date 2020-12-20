import { ECS } from '.';
import { ECSDefine, ComponentInterface, ComponentFields } from './types';
interface ITestComp1 extends ComponentInterface {
  fieldA: string;
  fieldB: number;
}
interface ITestComp2 extends ComponentInterface {
  fieldC: boolean;
}

interface ITestComp3 extends ComponentInterface {
  fieldD: boolean;
}

const testComp1: ComponentFields<ITestComp1> = {
  fieldA: { defaultValue: 'I am a string', type: 'string' },
  fieldB: { defaultValue: 123, type: 'number' },
};
const testComp2: ComponentFields<ITestComp2> = {
  fieldC: { defaultValue: true, type: 'boolean' },
};
const testComp3: ComponentFields<ITestComp3> = {
  fieldD: { defaultValue: true, type: 'boolean' },
};

interface ECSTest extends ECSDefine {
  components: {
    ITestComp1: ITestComp1;
    ITestComp2: ITestComp2;
    ITestComp3: ITestComp3;
  };
}

describe('Build ECS', () => {
  it('Add and Remove Entity', () => {
    const ecs = new ECS({
      ITestComp1: testComp1,
      ITestComp2: testComp2,
      ITestComp3: testComp3,
    });
    const entity = ecs.addEntity('first');
    ecs.update();
    expect(ecs.entity('first')).toBe(entity);

    expect(ecs.removeEntity(entity.$id)).toBeTruthy();
    expect(ecs.removeEntity('invalid-id')).toBeFalsy();
    ecs.update();
    expect(ecs.entity('first')).toBe(undefined);
  });

  it('Find entities by component', () => {
    const ecs = new ECS({
      ITestComp1: testComp1,
      ITestComp2: testComp2,
      ITestComp3: testComp3,
    });
    const entity = ecs.addEntity('first');
    ecs.addComponent<ECSTest>(entity, 'ITestComp1');
    ecs.update();

    const foundEntities = Array.from(ecs.entitiesByComponent('ITestComp1'));

    expect(foundEntities).toHaveLength(1);
    expect(foundEntities[0] === entity).toBeTruthy();
  });

  it('Add entity with components', () => {
    const ecs = new ECS({
      ITestComp1: testComp1,
      ITestComp2: testComp2,
      ITestComp3: testComp3,
    });
    const entity1 = ecs.addEntity<ECSTest>('first', 'ITestComp1', 'ITestComp2');
    const entity2 = ecs.addEntity<ECSTest>('first', 'ITestComp2');
    ecs.update();

    const foundEntitiesQ1 = Array.from(ecs.entitiesByComponent('ITestComp1'));
    const foundEntitiesQ2 = Array.from(ecs.entitiesByComponent('ITestComp2'));
    const foundEntitiesQ3 = Array.from(ecs.entitiesByComponent('ITestComp3'));

    expect(foundEntitiesQ1).toHaveLength(1);
    expect(foundEntitiesQ1[0] === entity1).toBeTruthy();

    expect(foundEntitiesQ2).toHaveLength(2);
    expect(foundEntitiesQ2.includes(entity1)).toBeTruthy();
    expect(foundEntitiesQ2.includes(entity2)).toBeTruthy();

    expect(foundEntitiesQ3).toHaveLength(0);
  });
});
