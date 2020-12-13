import { ECSDefine } from './types';
import { InternalECS } from './internal';

export class Identifiable<C extends ECSDefine> {
  private _$id: string = '';
  private _$ecs: InternalECS<C>;

  constructor($id: string, ecs: InternalECS<C>) {
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
