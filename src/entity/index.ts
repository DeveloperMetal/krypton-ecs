import { Identifiable } from '../utils';
import { Component } from '../component';
import { ComponentInterface, ECSDefine } from '../types';
import { InternalECS } from '../internal';

/**
 * Entity class which groups components. This class is instantiated internally.
 */
export class Entity<C extends ECSDefine> extends Identifiable<C> {
  private _components = new Map<string, Component<ComponentInterface, C>>();

  constructor($id: string, ecs: InternalECS<C>) {
    super($id, ecs);
  }

  /**
   * Adds a component to the entity.
   * @param component The component name to add.
   */
  addComponent<
    K extends keyof C['components'] & string
  > (component: K) {
    const newComponent = new Component<C['components'][K], C>(component, this.$ecs.components[component], this, this.$ecs);
    this._components.set(newComponent.$id, newComponent);
    const newComponentObject = newComponent.as<C['components'][K]>();
    this.$ecs.onComponentAddedToEntity(this, component as unknown as C['components'] & string)
    return newComponentObject;
  }

  /**
   * Removes a component from this entity.
   * @param component The component to remove by name.
   */
  removeComponent<K extends keyof C['components'] & string>(component: K) {
    this._components.delete(component);
    this.$ecs.onComponentRemovedFromEntity(this, component)
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
  component<K extends keyof C['components'] & string>(name: K) {
    return this._components.get(name)?.as<C['components'][K]>();
  }
}
