export const reduce = <T>(arr: Array<T>, fn: (c: T) => string): string => {
  return arr.reduce((p, c) => `${p}${fn(c)}`, '');
}