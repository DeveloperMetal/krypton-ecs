import { ECS } from "..";
import { FilterPredicate } from "../types";

export function* filter<T>(iterable: IterableIterator<T>, predicate: FilterPredicate<T>) {
  let i = 0;
  for(const item of iterable) {
    if (predicate(item, i++) ) {
      yield item;
    }
  }
}

export function genFilterPredicate<T>(predicate: FilterPredicate<T>) {
  return (_ecs: ECS, entities: IterableIterator<T>) => filter(entities, predicate);
}

export class Identifiable {
  private _$id: string = '';

  constructor($id: string) {
    this._$id = $id;
  }

  public get $id(): string {
    return this._$id;
  }
}