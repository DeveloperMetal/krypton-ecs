import { IEntitySchema } from '../schemas/types';
import { Component } from './component';
import { ComponentManager } from './componentManager';
import { Identifiable } from './utils';
export declare class Entity extends Identifiable {
    schema: IEntitySchema;
    private componentManager;
    constructor(schema: IEntitySchema, componentManager: ComponentManager);
    as<T>(): Entity & T;
    listComponents(): string[];
    getComponent<T>(name: string): Component & T;
    hasComponent(name: string): boolean;
}
//# sourceMappingURL=entity.d.ts.map