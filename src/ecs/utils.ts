export class Identifiable {
  private _$id: string = '';

  public get $id(): string {
    return this._$id;
  }

  public set $id(value: string) {
    this._$id = value;
  }
}
