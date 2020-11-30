import { Identifiable } from './utils';
import { Component } from './component';
import { ComponentInterface, ECSDefine } from './types';
import { InternalECS } from './internal';
export class Entity<C extends ECSDefine> extends Identifiable<C> {
  private _components = new Map<string, Component<ComponentInterface, C>>();

  constructor($id: string, ecs: InternalECS<C>) {
    super($id, ecs);
  }

  addComponent<
    K extends keyof C['components'] & string
  > (component: K) {
    const newComponent = new Component<C['components'][K], C>(component, this.$ecs.components[component], this, this.$ecs);
    this._components.set(newComponent.$id, newComponent);
    const newComponentObject = newComponent.as<C['components'][K]>();
    this.$ecs.onComponentAddedToEntity(this, component as unknown as C['components'] & string)
    return newComponentObject;
  }

  removeComponent<K extends keyof C['components'] & string>(component: K) {
    this._components.delete(component);
    this.$ecs.onComponentRemovedFromEntity(this, component)
  }

  listComponents() {
    return Array.from(this._components.keys());
  }

  component<K extends keyof C['components'] & string>(name: K) {
    return this._components.get(name)?.as<C['components'][K]>();
  }
}
