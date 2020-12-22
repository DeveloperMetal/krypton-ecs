import { Identifiable } from '../utils';
import { Component } from '../component';
import { ECSDefine, IComponent } from '../types';
import { InternalECS } from '../internal';

/**
 * Entity class which groups components. This class is instantiated internally.
 */
export class Entity extends Identifiable {
  private _components = new Map<string, Component>();

  constructor($id: string, ecs: InternalECS) {
    super($id, ecs);
  }

  /**
   * Adds a component to the entity.
   * @param component The component name to add.
   */
  addComponent<C extends ECSDefine, K extends keyof C>(component: K): C[K] & IComponent {
    const newComponent = new Component(component as string, this, this.$ecs);
    this._components.set(newComponent.$id, newComponent);
    const newComponentObject = newComponent.as<C, K>();
    this.$ecs.onComponentAddedToEntity(this, component as string);
    return newComponentObject
  }

  /**
   * Removes a component from this entity.
   * @param component The component to remove by name.
   */
  removeComponent<C extends ECSDefine>(component: keyof C & string) {
    this._components.delete(component);
    this.$ecs.onComponentRemovedFromEntity(this, component);
  }

  /**
   * Lists all component attached to this entity by name.
   */
  listComponents() {
    return Array.from(this._components.keys());
  }

  /**
   * Retrieves a component object instance attached to this entity.
   * @param name The component name.
   */
  component<C extends ECSDefine, K extends keyof C>(name: K) {
    const comp = this._components.get(name as string);
    if ( comp ) {
      return comp.as<C, K>();
    } else {
      throw new Error(`Component Missing: ${name}`);
    }
  }
}
