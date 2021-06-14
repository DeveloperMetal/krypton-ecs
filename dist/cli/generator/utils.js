export const reduce = (arr, fn) => {
    return arr.reduce((p, c) => `${p}${fn(c)}`, '');
};
export class ImportCollection {
    constructor() {
        this.store = {};
    }
    add(packageName, entries) {
        if (!Reflect.has(this.store, packageName)) {
            Reflect.set(this.store, packageName, []);
        }
        this.store[packageName].push(...entries);
    }
}
export class ExportCollection {
    constructor() {
        this.store = {};
    }
    add(exportName, localName) {
        this.store[exportName] = localName;
    }
}
export class BaseCodeGenerator {
    constructor() {
        this.importStore = new ImportCollection();
        this.exportStore = new ExportCollection();
        this.src = [];
    }
    exportTemplate(_exportName, _localName) {
        return "";
    }
    onGenerateExportStart(_src) { }
    onGenerateExportEnd(src) {
        return src.join("\n");
    }
    generateSrc() {
        return this.src.join("\n");
    }
    generateImports() {
        const src = [];
        for (const [name, importEntries] of Object.entries(this.importStore.store)) {
            const importCode = this.importTemplate(name, importEntries);
            src.push(importCode);
        }
        return src.join("\n");
    }
    generateExports() {
        const src = [];
        this.onGenerateExportStart(src);
        for (const [exportName, localName] of Object.entries(this.exportStore)) {
            const exportCode = this.exportTemplate(exportName, localName);
            src.push(exportCode);
        }
        return this.onGenerateExportEnd(src);
    }
    collect(ginfo) {
        if (ginfo.imports) {
            for (let importEntry of ginfo.imports) {
                this.importStore.add(importEntry.package, importEntry.imports);
            }
        }
        if (ginfo.exports) {
            for (let exportEntry of ginfo.exports) {
                this.exportStore.add(exportEntry.exportName, exportEntry.localName);
            }
        }
        if (typeof ginfo.src === "string") {
            this.src.push(ginfo.src);
        }
        else {
            this.src.push(ginfo.src());
        }
    }
}
export class JSGenerator extends BaseCodeGenerator {
    importTemplate(from, importEntries) {
        return `const {${importEntries.join(',')}} = require("${from}");`;
    }
    exportTemplate(exportName, localName) {
        return `${exportName}: ${localName}`;
    }
    onGenerateExportEnd(src) {
        const output = ["module.export = {", src.join(",\n"), "}"];
        return output.join("\n");
    }
}
export class TSTypesGenerator extends BaseCodeGenerator {
    importTemplate(from, importEntries) {
        return `import {${importEntries.join(',')}} from '${from}'`;
    }
}
//# sourceMappingURL=utils.js.map