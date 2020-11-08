var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
define("ecs/utils", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Identifiable = void 0;
    class Identifiable {
        constructor() {
            this._$id = "";
        }
        get $id() {
            return this._$id;
        }
        set $id(value) {
            this._$id = value;
        }
    }
    exports.Identifiable = Identifiable;
});
define("ecs/component", ["require", "exports", "ecs/utils"], function (require, exports, utils_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Component = void 0;
    class Component extends utils_1.Identifiable {
        constructor(id, fieldDef) {
            super();
            this._fieldDef = fieldDef;
            this.$id = id;
            let prox = new Proxy(this, {
                set(obj, key, value) {
                    if (key in obj._fieldDef) {
                        let def = Reflect.get(obj._fieldDef, key);
                        if (!def.nullable && value === null) {
                            throw new TypeError("Invalid Type. Field is not nullable");
                        }
                        if (!def.nullable && typeof value !== def.type) {
                            throw new TypeError("Invalid Type");
                        }
                        return Reflect.set(obj, key, value);
                    }
                    throw new TypeError(`Field ${String(key)} not found`);
                }
            });
            for (let key of Object.keys(this._fieldDef)) {
                if (this._fieldDef[key].defaultValue !== undefined) {
                    Reflect.set(prox, key, this._fieldDef[key].defaultValue);
                }
                else if (this._fieldDef[key].nullable) {
                    Reflect.set(prox, key, null);
                }
                else {
                    throw new TypeError("Default Value is required when field is not nullable");
                }
            }
            return prox;
        }
        keys() {
            return Object.keys(this._fieldDef);
        }
        as() {
            return this;
        }
    }
    exports.Component = Component;
});
define("ecs/entity", ["require", "exports", "ecs/utils"], function (require, exports, utils_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Entity = void 0;
    class Entity extends utils_2.Identifiable {
        constructor() {
            super(...arguments);
            this._components = new Map();
        }
        addComponent(component) {
            this._components.set(component.$id, component);
        }
        removeComponent(id) {
            this._components.delete(id);
        }
        listComponents() {
            return Array.from(this._components.keys());
        }
    }
    exports.Entity = Entity;
});
define("ecs/index", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ECS = void 0;
    class ECS {
        constructor() {
            this._entities = new Map();
        }
        entity(id) {
            return this._entities.get(id);
        }
        addEntity(entity) {
            this._entities.set(entity.$id, entity);
        }
        removeEntity(id) {
            return this._entities.delete(id);
        }
    }
    exports.ECS = ECS;
});
define("index", ["require", "exports", "ecs/index"], function (require, exports, ecs_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(ecs_1, exports);
});
define("ecs/component.spec", ["require", "exports", "ecs/component"], function (require, exports, component_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const testComp1 = {
        "fieldA": { defaultValue: "I am a string", type: "string" },
        "fieldB": { defaultValue: 123, type: "number" },
        "fieldC": { defaultValue: true, type: "boolean" },
        "fieldD": { type: "string", nullable: true }
    };
    describe("Components", () => {
        it("Create Component", () => {
            let compRaw = new component_1.Component("comp1", testComp1);
            let comp = compRaw.as();
            expect(comp.fieldA).toEqual(testComp1.fieldA.defaultValue);
            expect(comp.fieldB).toEqual(testComp1.fieldB.defaultValue);
            expect(comp.fieldC).toEqual(testComp1.fieldC.defaultValue);
            expect(comp.fieldD).toEqual(null);
        });
        it("Invalid Component field type", () => {
            let compRaw = new component_1.Component("comp1", testComp1);
            let comp = compRaw.as();
            expect(() => {
                Reflect.set(comp, "fieldA", 123);
            }).toThrowError("Invalid Type");
            expect(() => {
                Reflect.set(comp, "fieldA", null);
            }).toThrowError("Invalid Type. Field is not nullable");
        });
        it("Set invalid field", () => {
            let compRaw = new component_1.Component("comp1", testComp1);
            let comp = compRaw.as();
            expect(() => {
                Reflect.set(comp, "fieldX", 123);
            }).toThrowError("Field fieldX not found");
        });
        it("Missing nullable definition", () => {
            let comp1Copy = Object.assign({}, testComp1);
            comp1Copy.fieldA = Object.assign({}, comp1Copy.fieldA);
            Reflect.deleteProperty(comp1Copy.fieldA, "defaultValue");
            expect(() => {
                new component_1.Component("comp1", comp1Copy);
            }).toThrowError("Default Value is required when field is not nullable");
        });
        it("List keys", () => {
            let compRaw = new component_1.Component("comp1", testComp1);
            expect(compRaw.keys()).toStrictEqual(["fieldA", "fieldB", "fieldC", "fieldD"]);
        });
    });
});
define("ecs/entity.spec", ["require", "exports", "ecs/component", "ecs/entity"], function (require, exports, component_2, entity_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const testComp1 = {
        "fieldA": { defaultValue: "I am a string", type: "string" },
        "fieldB": { defaultValue: 123, type: "number" },
        "fieldC": { defaultValue: true, type: "boolean" }
    };
    describe("Entity", () => {
        it("Add/Remove Component", () => {
            let entity = new entity_1.Entity();
            let comp1 = new component_2.Component("comp1", testComp1);
            entity.addComponent(comp1);
            expect(entity.listComponents()).toStrictEqual(["comp1"]);
            entity.removeComponent("comp1");
            expect(entity.listComponents()).toStrictEqual([]);
        });
    });
});
define("ecs/index.spec", ["require", "exports", "ecs/index", "ecs/entity"], function (require, exports, _1, entity_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    describe("Build ECS", () => {
        it("Add and Remove Entity", () => {
            let ecs = new _1.ECS();
            let entity = new entity_2.Entity();
            entity.$id = "first";
            ecs.addEntity(entity);
            expect(ecs.entity("first")).toBe(entity);
            ecs.removeEntity(entity.$id);
            expect(ecs.entity("first")).toBe(undefined);
        });
    });
});
//# sourceMappingURL=framework.js.map