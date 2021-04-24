import { EXEC_PER_FRAME } from './contants';
import { ComponentManager } from './data/componentManager';
import { EntityCollection } from './data/entityCollection';
import { Pipeline } from './data/pipeline';
import { IComponentSchema, IECSSchema } from './schemas/types';
import { ECSOpts } from './types';
export * from './schemas/types';
export * from './data/entity';

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

  /**
   * ECS instance name
   */
  get name(): string {
    return this.opts.name || "default";
  }

  /**
   * ECS Component/Entity Schema
   */
  get schema(): IECSSchema {
    return this.opts.schema;
  }

  /**
   * Collection of systems on the default pipeline
   */
  get systems() {
    const perFrame = this.pipeline.children.get(EXEC_PER_FRAME) as Pipeline;
    return perFrame?.systems;
  }

  /**
   * Dynamically adds a component definition to the running ecs instance.
   * @param schema
   */
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