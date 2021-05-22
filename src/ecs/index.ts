import { ECSBase } from './ecs_base';
export * from './types';
export * from './ecs_base';
export * from './schemas/types';
export * from './data/entity';

/**
 * Default typeless ECS class for normal js implementations and testing.
 */
export class ECS extends ECSBase<{}, string> {}