import { ComponentInterface, ComponentFields, ECSDefine } from './types';
import { ECS } from '.';

interface ITestComp1 extends ComponentInterface {
  fieldA: string;
  fieldB: number;
  fieldC: boolean;
}

const testComp1: ComponentFields<ITestComp1> = {
  fieldA: { defaultValue: 'I am a string', type: 'string' },
  fieldB: { defaultValue: 123, type: 'number' },
  fieldC: { defaultValue: true, type: 'boolean' },
};
interface ECSTest extends ECSDefine {
  components: {
    ITestComp1: ITestComp1
  }
}

describe('Entity', () => {
  it('Add Entity', () => {
    const ecs = new ECS<ECSTest>({
      ITestComp1: testComp1
    })
    const entity = ecs.addEntity("test")
    ecs.update();
    expect(ecs.entity('test') === entity).toBeTruthy();
  })

  it('Add/Remove Component', () => {
    const ecs = new ECS<ECSTest>({
      ITestComp1: testComp1
    })
    const entity = ecs.addEntity("test")
    const comp1 = ecs.addComponent(entity, "ITestComp1");

    ecs.update();
    expect(comp1).toBeTruthy();
    expect(entity.listComponents()).toStrictEqual(['ITestComp1']);

    entity.removeComponent("ITestComp1")
    ecs.update();
    expect(entity.listComponents()).toStrictEqual([]);
  });

  it('Get component', () => {
    const ecs = new ECS<ECSTest>({
      ITestComp1: testComp1
    })
    const entity = ecs.addEntity("test")
    ecs.addComponent(entity, "ITestComp1");
    const comp1 = entity.component("ITestComp1");

    ecs.update();
    expect(comp1?.$id).toBe("ITestComp1");

    // Force a bad key call
    expect(Reflect.apply(entity.component, entity, ["bad-name"])).toBeUndefined();
  });
});
