import { Identifiable } from '../utils';
import { Component } from '../component';
import { ECSDefine } from '../types';
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
  addComponent<C extends ECSDefine>(component: keyof C['components'] & string) {
    const newComponent = new Component(component, this, this.$ecs);
    this._components.set(newComponent.$id, newComponent);
    const newComponentObject = newComponent.as<C, typeof component>();
    this.$ecs.onComponentAddedToEntity(this, (component as unknown) as C['components'] & string);
    return newComponentObject;
  }

  /**
   * Removes a component from this entity.
   * @param component The component to remove by name.
   */
  removeComponent<C extends ECSDefine>(component: keyof C['components'] & string) {
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
  component<C extends ECSDefine>(name: keyof C['components'] & string) {
    return this._components.get(name)?.as<C, typeof name>();
  }
}
