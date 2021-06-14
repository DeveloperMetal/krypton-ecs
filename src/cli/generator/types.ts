export interface IGeneratorArgs {
  _: string[],
  "$0": string,
  in: string,
  out: string,
  i: string,
  o: string
}
export interface IGeneratorInfo {
  imports?: ImportEntries
  exports?: ExportEntries
  src: string | (() => string)
}

export type IPackageImport = { package: string, imports: string[] };
export type IPackageExport = { exportName: string, localName: string };
export type ImportEntries = IPackageImport[];
export type ExportEntries = IPackageExport[];
export type ImportStore = { [key: string]: string[] }
export type ExportStore = { [key: string]: string }
