import { ImportStore, IGeneratorInfo, ExportStore } from "./types";
export declare const reduce: <T>(arr: T[], fn: (c: T) => string) => string;
export declare class ImportCollection {
    store: ImportStore;
    constructor();
    add(packageName: string, entries: string[]): void;
}
export declare class ExportCollection {
    store: ExportStore;
    constructor();
    add(exportName: string, localName: string): void;
}
export interface ICodeGenerator {
    generateSrc(): string;
    generateImports(): string;
    collect(ginfo: IGeneratorInfo): void;
    importTemplate(from: string, importEntries: string[]): string;
    exportTemplate(exportName: string, localName: string): string;
    onGenerateExportStart(src: string[]): void;
    onGenerateExportEnd(src: string[]): string;
}
export declare abstract class BaseCodeGenerator implements ICodeGenerator {
    importStore: ImportCollection;
    exportStore: ExportCollection;
    src: string[];
    abstract importTemplate(from: string, importEntries: string[]): string;
    exportTemplate(_exportName: string, _localName: string): string;
    onGenerateExportStart(_src: string[]): void;
    onGenerateExportEnd(src: string[]): string;
    constructor();
    generateSrc(): string;
    generateImports(): string;
    generateExports(): string;
    collect(ginfo: IGeneratorInfo): void;
}
export declare class JSGenerator extends BaseCodeGenerator {
    importTemplate(from: string, importEntries: string[]): string;
    exportTemplate(exportName: string, localName: string): string;
    onGenerateExportEnd(src: string[]): string;
}
export declare class TSTypesGenerator extends BaseCodeGenerator {
    importTemplate(from: string, importEntries: string[]): string;
}
//# sourceMappingURL=utils.d.ts.map