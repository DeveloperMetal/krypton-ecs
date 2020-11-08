import { Identifiable } from './utils';
import { Component, ComponentInterface } from './component';

export class Entity extends Identifiable {
  private _components = new Map<string, Component<ComponentInterface>>();

  public addComponent<T extends ComponentInterface>(component: Component<T>) {
    this._components.set(component.$id, component);
  }

  public removeComponent(id: string) {
    this._components.delete(id);
  }

  public listComponents() {
    return Array.from(this._components.keys());
  }
}
