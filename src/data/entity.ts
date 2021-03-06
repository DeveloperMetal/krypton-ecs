import { IDefinitions } from 'types';
import { IComponents, IEntitySchema } from '../schemas/types';
import { Component } from './component';
import { ComponentManager } from './componentManager';
import { Identifiable } from './utils';

/**
 * Entity class which groups components. This class is instantiated internally.
 */
export class ECSEntity<D extends IDefinitions, C extends IComponents> extends Identifiable {
  constructor(public schema: IEntitySchema<C>, private componentManager: ComponentManager<D, C>) {
    super(schema.entity);
    let inConstructor = true;

    const prox = new Proxy(this, {
      get(target, prop) {
        if(Reflect.has(target, prop)) {
          return Reflect.get(target, prop);
        }

        throw new Error(`Component "${String(prop)}" does not exist`);
      },

      set(target, prop, value, _receiver) {
        if ( !inConstructor ) {
          throw new Error("You can not add components directly to an entity");
        }

        return Reflect.set(target, prop, value);
      }
    });

    for(const componentName of this.schema.components) {
      Reflect.set(prox, componentName, this.componentManager.newComponentInstance(componentName, prox));
    }

    inConstructor = false;

    return prox;
  }

  /**
   * Convenient helper to cast this entity to an interface to ease component invocations.
   */
  as<T>() {
    return this as unknown as ECSEntity<D, C> & T;
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
  getComponent<T>(name: C): Component<D, C> & T {
    return Reflect.get(this, name);
  }

  /**
   * Returns true or false wether a component exists on this component
   * @param name The component name to check.
   */
  hasComponent(name: C) {
    return Reflect.has(this, name);
  }
}
