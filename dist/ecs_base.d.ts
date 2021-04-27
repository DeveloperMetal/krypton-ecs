import { ComponentManager } from './data/componentManager';
import { EntityCollection } from './data/entityCollection';
import { Pipeline } from './data/pipeline';
import { IComponentSchema, IECSSchema } from './schemas/types';
import { ECSOpts, IComponentDefinition } from './types';
export * from './schemas/types';
export * from './data/entity';
export declare const globalECSCache: Map<string, ECSBase<any>>;
export declare class ECSBase<C extends IComponentDefinition> {
    readonly opts: ECSOpts;
    readonly entities: EntityCollection<C>;
    readonly pipeline: Pipeline<C>;
    readonly componentManager: ComponentManager<C>;
    constructor(opts: ECSOpts);
    get name(): string;
    get schema(): IECSSchema;
    get systems(): import("./data").SystemCollection<C>;
    addComponent(schema: IComponentSchema): void;
    update(executionGroup?: string): Promise<void>;
}
//# sourceMappingURL=ecs_base.d.ts.map