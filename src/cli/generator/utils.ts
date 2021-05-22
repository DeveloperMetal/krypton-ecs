export const reduce = <T>(arr: T[], fn: (c: T) => string): string => {
  return arr.reduce((p, c) => `${p}${fn(c)}`, '');
}