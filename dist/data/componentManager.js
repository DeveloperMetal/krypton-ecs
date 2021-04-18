import { Component } from "./component";
export class ComponentManager {
    constructor(_ecs) {
        this._ecs = _ecs;
        this._componentSchemas = new Map();
        for (const schema of this._ecs.schema.components) {
            this._componentSchemas.set(schema.component, schema);
        }
    }
    newComponentInstance(name, parent) {
        const schema = this._componentSchemas.get(name);
        if (schema) {
            return new Component(schema, parent, this.useTypeGuards);
        }
        throw new Error("Component schema missing");
    }
    get useTypeGuards() {
        return this._ecs.opts.useTypeGuards || false;
    }
}
//# sourceMappingURL=componentManager.js.map