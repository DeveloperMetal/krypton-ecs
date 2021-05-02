import { Identifiable } from './utils';
export class ECSEntity extends Identifiable {
    constructor(schema, componentManager) {
        super(schema.entity);
        this.schema = schema;
        this.componentManager = componentManager;
        let inConstructor = true;
        const prox = new Proxy(this, {
            get(target, prop) {
                if (Reflect.has(target, prop)) {
                    return Reflect.get(target, prop);
                }
                throw new Error(`Component "${String(prop)}" does not exist`);
            },
            set(target, prop, value, _receiver) {
                if (!inConstructor) {
                    throw new Error("You can not add components directly to an entity");
                }
                return Reflect.set(target, prop, value);
            }
        });
        for (const componentName of this.schema.components) {
            Reflect.set(prox, componentName, this.componentManager.newComponentInstance(componentName, prox));
        }
        inConstructor = false;
        return prox;
    }
    as() {
        return this;
    }
    listComponents() {
        return this.schema.components;
    }
    getComponent(name) {
        return Reflect.get(this, name);
    }
    hasComponent(name) {
        return Reflect.has(this, name);
    }
}
//# sourceMappingURL=entity.js.map