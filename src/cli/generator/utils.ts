import { ImportStore, IGeneratorInfo, ExportStore } from "./types";

export const reduce = <T>(arr: T[], fn: (c: T) => string): string => {
  return arr.reduce((p, c) => `${p}${fn(c)}`, '');
}
export class ImportCollection {
  public store:ImportStore
  constructor() {
    this.store = {}
  }

  public add(packageName: string, entries: string[]) {
    if ( !Reflect.has(this.store, packageName) ) {
      Reflect.set(this.store, packageName, []);
    }
    this.store[packageName].push(...entries);
  }
}

export class ExportCollection {
  public store:ExportStore
  constructor() {
    this.store = {}
  }

  public add(exportName: string, localName:string) {
    this.store[exportName] = localName
  }
}

export interface ICodeGenerator {
  generateSrc(): string
  generateImports(): string
  collect(ginfo: IGeneratorInfo): void

  importTemplate(from: string, importEntries: string[]): string

  exportTemplate(exportName: string, localName: string): string
  onGenerateExportStart(src: string[]): void
  onGenerateExportEnd(src: string[]): string
}

export abstract class BaseCodeGenerator implements ICodeGenerator {
  public importStore: ImportCollection;
  public exportStore: ExportCollection;
  public src: string[];

  abstract importTemplate(from: string, importEntries: string[]): string;
  exportTemplate(_exportName: string, _localName: string): string {
    return "";
  }

  onGenerateExportStart(_src: string[]) {}
  onGenerateExportEnd(src: string[]):string {
    return src.join("\n");
  }

  constructor() {
    this.importStore = new ImportCollection();
    this.exportStore = new ExportCollection();
    this.src = [];
  }

  generateSrc() {
    return this.src.join("\n");
  }

  generateImports() {
    const src: string[] = [];
    for(const [name, importEntries] of Object.entries(this.importStore.store)) {
      const importCode = this.importTemplate(name, importEntries);
      src.push(importCode);
    }

    return src.join("\n");
  }

  generateExports() {
    const src: string[] = [];
    this.onGenerateExportStart(src);
    for(const [exportName, localName] of Object.entries(this.exportStore)) {
      const exportCode = this.exportTemplate(exportName, localName);
      src.push(exportCode);
    }
    return this.onGenerateExportEnd(src);
  }

  collect(ginfo: IGeneratorInfo) {
    if ( ginfo.imports ) {
      for(let importEntry of ginfo.imports) {
        this.importStore.add(importEntry.package, importEntry.imports);
      }
    }

    if ( ginfo.exports ) {
      for(let exportEntry of ginfo.exports) {
        this.exportStore.add(exportEntry.exportName, exportEntry.localName)
      }
    }

    if ( typeof ginfo.src === "string" ) {
      this.src.push(ginfo.src);
    } else {
      this.src.push(ginfo.src());
    }
  }
}

export class JSGenerator extends BaseCodeGenerator {
  importTemplate(from: string, importEntries: string[]): string {
    return `const {${importEntries.join(',')}} = require("${from}");`;
  }

  exportTemplate(exportName: string, localName: string): string {
    return `${exportName}: ${localName}`;
  }
  onGenerateExportEnd(src: string[]): string {
    const output = ["module.export = {", src.join(",\n"), "}"];
    return output.join("\n");
  }
}

export class TSTypesGenerator extends BaseCodeGenerator {
  importTemplate(from: string, importEntries: string[]) {
    return `import {${importEntries.join(',')}} from '${from}'`;
  }
}