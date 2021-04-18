export function* filter(iterable, predicate) {
    let i = 0;
    for (const item of iterable) {
        if (predicate(item, i++)) {
            yield item;
        }
    }
}
export function genFilterPredicate(predicate) {
    return (_ecs, entities) => filter(entities, predicate);
}
export class Identifiable {
    constructor($id) {
        this._$id = '';
        this._$id = $id;
    }
    get $id() {
        return this._$id;
    }
}
//# sourceMappingURL=utils.js.map