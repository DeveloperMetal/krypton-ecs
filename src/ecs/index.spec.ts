import { ECS } from '.';
import { Entity } from './entity';

describe('Build ECS', () => {
  it('Add and Remove Entity', () => {
    const ecs = new ECS();
    const entity = new Entity();
    entity.$id = 'first';

    ecs.addEntity(entity);
    expect(ecs.entity('first')).toBe(entity);

    ecs.removeEntity(entity.$id);
    expect(ecs.entity('first')).toBe(undefined);
  });
});
