import { IDefinitions } from '../types';
import { IComponents, IEntitySchema } from '../schemas/types';
import { Component } from './component';
import { ComponentManager } from './componentManager';
import { Identifiable } from './utils';
export declare class ECSEntity<D extends IDefinitions, C extends IComponents> extends Identifiable {
    schema: IEntitySchema<C>;
    private componentManager;
    constructor(schema: IEntitySchema<C>, componentManager: ComponentManager<D, C>);
    as<T>(): ECSEntity<D, C> & T;
    listComponents(): C[];
    getComponent<T>(name: C): Component<D, C> & T;
    hasComponent(name: C): boolean;
}
//# sourceMappingURL=entity.d.ts.map