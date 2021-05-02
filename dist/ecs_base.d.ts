import { ComponentManager } from './data/componentManager';
import { EntityCollection } from './data/entityCollection';
import { Pipeline } from './data/pipeline';
import { IComponents, IComponentSchema, IECSSchema } from './schemas/types';
import { ECSOpts, IDefinitions } from './types';
export * from './schemas/types';
export * from './data/entity';
export declare const globalECSCache: Map<string, ECSBase<any, any>>;
export declare class ECSBase<D extends IDefinitions, C extends IComponents> {
    readonly opts: ECSOpts<C>;
    readonly entities: EntityCollection<D, C>;
    readonly pipeline: Pipeline<D, C>;
    readonly componentManager: ComponentManager<D, C>;
    constructor(opts: ECSOpts<C>);
    get name(): string;
    get schema(): IECSSchema<C>;
    get systems(): import("./data").SystemCollection<D, C>;
    addComponent(schema: IComponentSchema): void;
    update(executionGroup?: string): Promise<void>;
}
//# sourceMappingURL=ecs_base.d.ts.map