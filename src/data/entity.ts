import { IEntitySchema } from '../schema/types';
import { Component } from './component';
import { ComponentManager } from './componentManager';
import { Identifiable } from './utils';

/**
 * Entity class which groups components. This class is instantiated internally.
 */
export class Entity extends Identifiable {
  constructor(public schema: IEntitySchema, private componentManager: ComponentManager) {
    super(schema.entity);

    const prox = new Proxy(this, {
      get(target, prop) {
        if(target.hasOwnProperty(prop)) {
          return Reflect.get(target, prop);
        }

        throw new Error("Component does not exist");
      },

      set(_target, _prop, _value, _receiver) {
        throw new Error("You can not add components directly to an entity");
      }
    });

    for(const componentName of this.schema.components) {
      Reflect.set(prox, componentName, this.componentManager.newComponentInstance(componentName, this));
    }

    return prox;
  }

  typed<T>() {
    return this as unknown as Entity & T;
  }

  /**
   * Lists all component attached to this entity by name.
   */
  listComponents() {
    return this.schema.components;
  }

  /**
   * Retrieves a component object instance attached to this entity.
   * @param name The component name.
   */
  getComponent<T>(name: string): Component & T {
    return Reflect.get(this, name);
  }

  /**
   * Returns true or false wether a component exists on this component
   * @param name The component name to check.
   */
  hasComponent(name: string) {
    return Reflect.has(this, name);
  }
}
