import { Identifiable } from '../utils';
import { Component } from '../component';
import { ECSDefine, IComponentAPI } from '../types';
import { InternalECS } from '../internal';

/**
 * Entity class which groups components. This class is instantiated internally.
 */
export class Entity<C extends ECSDefine> extends Identifiable<C> {
  private _components = new Map<string, Component<C>>();

  constructor($id: string, ecs: InternalECS<C>) {
    super($id, ecs);
  }

  /**
   * Adds a component to the entity.
   * @param component The component name to add.
   */
  add<K extends keyof C>(component: K): C[K] & IComponentAPI<C> {
    const newComponent = new Component<C>(component as string, this, this.$ecs);
    this._components.set(newComponent.$id, newComponent);
    const newComponentObject = newComponent.as<K>();
    this.$ecs.onComponentAddedToEntity(this, component as string);
    return newComponentObject;
  }

  /**
   * Removes a component from this entity.
   * @param component The component to remove by name.
   */
  remove<K extends keyof C>(component: K) {
    this._components.delete(component as string);
    this.$ecs.onComponentRemovedFromEntity(this, component as string);
  }

  /**
   * Lists all component attached to this entity by name.
   */
  list() {
    return Array.from(this._components.keys());
  }

  /**
   * Retrieves a component object instance attached to this entity.
   * @param name The component name.
   */
  get<K extends keyof C>(name: K) {
    const comp = this._components.get(name as string);
    if (comp) {
      return comp.as<K>();
    } else {
      throw new Error(`Component Missing: ${name}`);
    }
  }

  /**
   * Returns true or false wether a component exists on this component
   * @param name The component name to check.
   */
  has<K extends keyof C>(name: K) {
    return this._components.has(name as string);
  }

  resetModifiedComponents() {
    this._components.forEach((c) => c.resetModifiedFields());
  }
}
