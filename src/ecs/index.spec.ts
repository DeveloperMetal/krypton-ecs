import { ECS } from '.';
import { ECSDefine, ComponentInterface, ComponentFields } from './types';
interface ITestComp1 extends ComponentInterface {
  fieldA: string;
  fieldB: number;
}
interface ITestComp2 extends ComponentInterface {
  fieldC: boolean;
}

const testComp1: ComponentFields<ITestComp1> = {
  fieldA: { defaultValue: 'I am a string', type: 'string' },
  fieldB: { defaultValue: 123, type: 'number' }
};
const testComp2: ComponentFields<ITestComp2> = {
  fieldC: { defaultValue: true, type: 'boolean' },
};

interface ECSTest extends ECSDefine {
  components: {
    ITestComp1: ITestComp1
    ITestComp2: ITestComp2
  }
}

describe('Build ECS', () => {
  it('Add and Remove Entity', () => {
    const ecs = new ECS<ECSTest>({
      ITestComp1: testComp1,
      ITestComp2: testComp2
    });
    const entity = ecs.addEntity('first');
    ecs.update();
    expect(ecs.entity('first')).toBe(entity);

    ecs.removeEntity(entity.$id);
    ecs.update();
    expect(ecs.entity('first')).toBe(undefined);
  });

  it('Find entities by component', () => {
    const ecs = new ECS<ECSTest>({
      ITestComp1: testComp1,
      ITestComp2: testComp2
    });
    const entity = ecs.addEntity('first');
    ecs.addComponent(entity, "ITestComp1");
    ecs.update();

    const foundEntities = Array.from(ecs.entitiesByComponent("ITestComp1"));

    expect(foundEntities).toHaveLength(1);
    expect(foundEntities[0] === entity).toBeTruthy();
  });

  it('Add entity with components', () => {
    const ecs = new ECS<ECSTest>({
      ITestComp1: testComp1,
      ITestComp2: testComp2
    });
    const entity1 = ecs.addEntity('first', "ITestComp1", "ITestComp2");
    const entity2 = ecs.addEntity('first', "ITestComp2");
    ecs.update();

    const foundEntitiesQ1 = Array.from(ecs.entitiesByComponent("ITestComp1"));
    const foundEntitiesQ2 = Array.from(ecs.entitiesByComponent("ITestComp2"));

    expect(foundEntitiesQ1).toHaveLength(1);
    expect(foundEntitiesQ1[0] === entity1).toBeTruthy();

    expect(foundEntitiesQ2).toHaveLength(2);
    expect(foundEntitiesQ2.includes(entity1)).toBeTruthy();
    expect(foundEntitiesQ2.includes(entity2)).toBeTruthy();
  })

});
