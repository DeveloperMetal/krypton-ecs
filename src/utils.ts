import { InternalECS } from './internal';

export class Identifiable {
  private _$id: string = '';
  private _$ecs: InternalECS;

  constructor($id: string, ecs: InternalECS) {
    this._$id = $id;
    this._$ecs = ecs;
  }

  public get $ecs() {
    return this._$ecs;
  }

  public get $id(): string {
    return this._$id;
  }
}
