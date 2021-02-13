import { ECS, Entity, IComponentSchema } from "..";
import { ECSOpts } from "../types";
import { Component } from "./component";

export class ComponentManager {
  private _componentSchemas = new Map<string, IComponentSchema>();

  constructor(private _ecs: ECS, private _ecsOpts: ECSOpts) {
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
    return this._ecsOpts.useTypeGuards || false;
  }

}