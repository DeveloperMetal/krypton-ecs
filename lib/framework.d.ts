declare module "ecs/utils" {
    export class Identifiable {
        private _$id;
        get $id(): string;
        set $id(value: string);
    }
}
declare module "ecs/component" {
    import { Identifiable } from "ecs/utils";
    export type FieldTypeof = "number" | "string" | "bigint" | "boolean";
    export type FieldType = string | number | bigint | boolean;
    export type FieldDefinition = {
        defaultValue?: FieldType;
        type: FieldTypeof;
        nullable?: boolean;
    };
    export type ComponentFields<T extends ComponentInterface> = {
        [field in keyof T]: FieldDefinition;
    };
    export interface IComponent {
        $id: string;
        keys(): string[];
    }
    export interface ComponentInterface {
        [index: string]: FieldType | null;
    }
    export class Component<T extends ComponentInterface> extends Identifiable implements IComponent {
        private _fieldDef;
        constructor(id: string, fieldDef: ComponentFields<T>);
        keys(): string[];
        as<A extends ComponentInterface>(): A & IComponent;
    }
}
declare module "ecs/entity" {
    import { Identifiable } from "ecs/utils";
    import { Component, ComponentInterface } from "ecs/component";
    export class Entity extends Identifiable {
        private _components;
        addComponent<T extends ComponentInterface>(component: Component<T>): void;
        removeComponent(id: string): void;
        listComponents(): string[];
    }
}
declare module "ecs/index" {
    import { Entity } from "ecs/entity";
    export class ECS {
        private _entities;
        entity(id: string): Entity | undefined;
        addEntity(entity: Entity): void;
        removeEntity(id: string): boolean;
    }
}
declare module "index" {
    export * from "ecs/index";
}
declare module "ecs/component.spec" { }
declare module "ecs/entity.spec" { }
declare module "ecs/index.spec" { }
//# sourceMappingURL=framework.d.ts.map