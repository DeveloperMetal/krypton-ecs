import { filter, genFilterPredicate } from "../data/utils";

describe("Utils", () => {
  it("Filter iterator", () => {
    const items = [1, 2, 3, 4, 5];
    const predicate = jest.fn((item, _i) => item !== 1);
    const result = filter(items.values(), predicate);
    expect(Array.from(result)).toStrictEqual([2, 3, 4, 5]);
  });

  it("Filter predicate generator", () => {
    const predicate = jest.fn();
    const generator = genFilterPredicate(predicate);
    expect(typeof generator).toBe("function");
  })
})