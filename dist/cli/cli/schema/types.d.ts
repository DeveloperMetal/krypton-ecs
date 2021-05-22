export declare type ISchemaInclude = {
    module: string;
    import: string;
} | string;
export interface IFieldSchema {
    type: "string" | "boolean" | "number" | "float32Array" | "object";
    defaultValue: string | boolean | number | object | null;
    allowNull: boolean;
}
export interface IComponentSchema {
    component: string;
    fields: {
        [name: string]: IFieldSchema;
    };
}
export interface IEntitySchema {
    entity: string;
    components: string[];
}
export interface IECSSchema {
    components: IComponentSchema[];
    entities?: IEntitySchema[];
}
export declare type GeneratorInput = {
    include: ISchemaInclude[];
} | IComponentSchema | IEntitySchema | IComponentSchema[] | IEntitySchema[];
//# sourceMappingURL=types.d.ts.map