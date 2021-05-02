import { IComponents } from "schemas";
import { IDefinitions } from "../types";
import { ECSBase, ECSEntity, IComponentSchema } from "..";
import { Component } from "./component";

/**
 * Component Manager handles tracking component schemas and instantiating components referenced in entities.
 */
export class ComponentManager<D extends IDefinitions, C extends IComponents> {
  private _componentSchemas = new Map<string, IComponentSchema>();

  constructor(private _ecs: ECSBase<D, C>) {
    for(const schema of this._ecs.schema.components) {
      this._componentSchemas.set(schema.component, schema);
    }
  }

  newComponentInstance(name: string, parent: ECSEntity<D, C>): Component<D, C> {
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