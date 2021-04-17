import { EXEC_PER_FRAME } from '@modules/constants';
import { ComponentManager } from '@modules/data/componentManager';
import { EntityCollection } from '@modules/data/entityCollection';
import { Pipeline } from '@modules/data/pipeline';
import { IComponentSchema, IECSSchema } from '@modules/schemas';
import { ECSOpts } from './types';
export * from '@modules/schemas/types';
export * from '@modules/data/entity';

/**
 * Manages multiple ECS Instances
 */
export const globalECSCache = new Map<string, ECS>();

/**
 * Type safe ECS system entry point.
 */
export class ECS {
  public readonly entities: EntityCollection;
  public readonly pipeline:Pipeline;
  public readonly componentManager: ComponentManager;

  constructor(public readonly opts: ECSOpts) {
    this.pipeline = new Pipeline(this);
    this.entities = new EntityCollection(this);
    this.componentManager = new ComponentManager(this);

    // Default pipeline
    this.pipeline.children.set(EXEC_PER_FRAME, new Pipeline(this));
    globalECSCache.set(this.name, this);
  }

  get name(): string {
    return this.opts.name || "default";
  }

  get schema(): IECSSchema {
    return this.opts.schema;
  }

  get systems() {
    const perFrame = this.pipeline.children.get(EXEC_PER_FRAME) as Pipeline;
    return perFrame?.systems;
  }

  addComponent(schema: IComponentSchema) {
    this.schema.components.push(schema);
  }

  /**
   * Triggers execution group systems.
   */
  async update(executionGroup: string = EXEC_PER_FRAME) {
    await this.pipeline.children.get(executionGroup)?.systems.executeSystems();
  }
}