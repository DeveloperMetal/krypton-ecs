export interface IGeneratorArgs {
    _: string[];
    "$0": string;
    in: string;
    out: string;
    i: string;
    o: string;
}
export interface IGeneratorInfo {
    imports?: ImportEntries;
    exports?: ExportEntries;
    src: string | (() => string);
}
export declare type IPackageImport = {
    package: string;
    imports: string[];
};
export declare type IPackageExport = {
    exportName: string;
    localName: string;
};
export declare type ImportEntries = IPackageImport[];
export declare type ExportEntries = IPackageExport[];
export declare type ImportStore = {
    [key: string]: string[];
};
export declare type ExportStore = {
    [key: string]: string;
};
//# sourceMappingURL=types.d.ts.map