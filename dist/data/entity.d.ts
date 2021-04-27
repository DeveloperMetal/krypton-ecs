import { IComponentDefinition } from 'types';
import { IEntitySchema } from '../schemas/types';
import { Component } from './component';
import { ComponentManager } from './componentManager';
import { Identifiable } from './utils';
export declare class Entity<C extends IComponentDefinition> extends Identifiable {
    schema: IEntitySchema;
    private componentManager;
    constructor(schema: IEntitySchema, componentManager: ComponentManager<C>);
    as<T>(): Entity<C> & T;
    listComponents(): string[];
    getComponent<T>(name: string): Component<C> & T;
    hasComponent(name: string): boolean;
}
//# sourceMappingURL=entity.d.ts.map