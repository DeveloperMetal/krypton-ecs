import { ECS, Entity, IComponentSchema } from "..";
import { Component } from "./component";

/**
 * Component Manager handles tracking component schemas and instantiating components referenced in entities.
 */
export class ComponentManager {
  private _componentSchemas = new Map<string, IComponentSchema>();

  constructor(private _ecs: ECS) {
    for(const schema of this._ecs.schema.components) {
      this._componentSchemas.set(schema.component, schema);
    }
  }

  newComponentInstance(name: string, parent: Entity): Component {
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