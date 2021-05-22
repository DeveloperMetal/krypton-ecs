import { EXEC_PER_FRAME } from './contants';
import { ComponentManager } from './data/componentManager';
import { EntityCollection } from './data/entityCollection';
import { Pipeline } from './data/pipeline';
import { IComponents, IComponentSchema, IECSSchema } from './schemas/types';
import { ECSOpts, IDefinitions } from './types';
export * from './schemas/types';
export * from './data/entity';

/**
 * Manages multiple ECS Instances
 */
export const globalECSCache = new Map<string, ECSBase<any, any>>();



/**
 * Type safe ECS system entry point.
 */
export class ECSBase<D extends IDefinitions, C extends IComponents> {
  public readonly entities: EntityCollection<D, C>;
  public readonly pipeline: Pipeline<D, C>;
  public readonly componentManager: ComponentManager<D, C>;

  constructor(public readonly opts: ECSOpts<C>) {
    this.pipeline = new Pipeline<D, C>(this);
    this.entities = new EntityCollection<D, C>(this);
    this.componentManager = new ComponentManager<D, C>(this);

    // Default pipeline
    this.pipeline.children.set(EXEC_PER_FRAME, new Pipeline<D, C>(this));
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
  get schema(): IECSSchema<C> {
    return this.opts.schema;
  }

  /**
   * Collection of systems on the default pipeline
   */
  get systems() {
    const perFrame = this.pipeline.children.get(EXEC_PER_FRAME) as Pipeline<D, C>;
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