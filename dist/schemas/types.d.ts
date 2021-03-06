export declare type IComponents = string;
export declare type ISchemaInclude = {
    module: string;
    import: string;
} | string;
export interface IFieldSchema {
    type: "string" | "boolean" | "number" | "float32Array" | "object" | string;
    defaultValue?: string | boolean | number | object | null;
    allowNull?: boolean;
}
export interface IComponentSchema {
    component: string;
    fields?: {
        [name: string]: IFieldSchema;
    };
}
export interface IEntitySchema<C extends IComponents> {
    entity: string;
    components: C[];
}
export interface IECSSchema<C extends IComponents> {
    components: IComponentSchema[];
    entities?: IEntitySchema<C>[];
}
export declare type GeneratorInput = {
    include: ISchemaInclude[];
} | IComponentSchema | IEntitySchema<string> | IComponentSchema[] | IEntitySchema<string>[];
//# sourceMappingURL=types.d.ts.map