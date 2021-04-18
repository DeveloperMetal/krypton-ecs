import { ComponentManager } from './data/componentManager';
import { EntityCollection } from './data/entityCollection';
import { Pipeline } from './data/pipeline';
import { IComponentSchema, IECSSchema } from './schemas/types';
import { ECSOpts } from './types';
export * from './schemas/types';
export * from './data/entity';
export declare const globalECSCache: Map<string, ECS>;
export declare class ECS {
    readonly opts: ECSOpts;
    readonly entities: EntityCollection;
    readonly pipeline: Pipeline;
    readonly componentManager: ComponentManager;
    constructor(opts: ECSOpts);
    get name(): string;
    get schema(): IECSSchema;
    get systems(): import("./data").SystemCollection;
    addComponent(schema: IComponentSchema): void;
    update(executionGroup?: string): Promise<void>;
}
//# sourceMappingURL=index.d.ts.map