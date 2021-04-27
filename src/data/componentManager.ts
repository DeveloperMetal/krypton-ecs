import { IComponentDefinition } from "types";
import { ECSBase, Entity, IComponentSchema } from "..";
import { Component } from "./component";

/**
 * Component Manager handles tracking component schemas and instantiating components referenced in entities.
 */
export class ComponentManager<C extends IComponentDefinition> {
  private _componentSchemas = new Map<string, IComponentSchema>();

  constructor(private _ecs: ECSBase<C>) {
    for(const schema of this._ecs.schema.components) {
      this._componentSchemas.set(schema.component, schema);
    }
  }

  newComponentInstance(name: string, parent: Entity<C>): Component<C> {
    const schema = this._componentSchemas.get(name);
    if ( schema ) {
      return new Component(schema, parent, this.useTypeGuards);
    }

    throw new Error("Component schema missing");
  }

  get useTypeGuards(): boolean {
    return this._ecs.opts.useTypeGuards || false;
  }

}