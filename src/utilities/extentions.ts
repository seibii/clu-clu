export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}

export const empty = <TValue>(
  value: TValue | null | undefined
): value is TValue => value === null || value === undefined;

export const isError = <Element>(
  element: Element | null | undefined
): boolean => Object.prototype.toString.call(element).slice(8, -1) === "Error";

export const makeUnique = <Element>(
  elem: Element,
  index: number,
  self: Element[]
): boolean => self.indexOf(elem) === index;

export const makeFlat = <Element>(
  acc: Element[],
  elements: Element[]
): Element[] => acc.concat(elements);

export const groupBy = <K, V>(
  array: readonly V[],
  getKey: (cur: V, idx: number, src: readonly V[]) => K
): [K, V[]][] =>
  Array.from(
    array.reduce((map, cur, idx, src) => {
      const key = getKey(cur, idx, src);
      const list = map.get(key);
      if (list) list.push(cur);
      else map.set(key, [cur]);
      return map;
    }, new Map<K, V[]>())
  );

export const makeSeqArray = (length: number): number[] =>
  [...Array(length)].map((_, i) => i);

export const isTrue = (boolean: boolean): boolean => boolean;
export const isFalse = (boolean: boolean): boolean => !boolean;
