type ArraySource<T> = ArrayLike<T> | Iterable<T>;
type Condition<T> = (v: T, i: number, c: T[]) => boolean;

export const array = {
  at,
  bisect,
  clone,
  from,
  last,
  lastIndex,
  reverse,
  // from regimen
  size,
  some,
  none,
  isEmpty,
  isNonEmpty,
};

function bisect<T>(index: number, source: ArraySource<T>) {
  const value = from(source);
  index =
    // clamp at end
    Math.abs(index) > value.length
      ? value.length - 1
      : // accepts fractions, for example 1/2
      index > 0 && index < 1
      ? Math.floor(index * value.length)
      : index < 0
      ? value.length - index
      : index;

  return [value.slice(0, index), value.slice(index)];
}

function at<T>(delta: number, source?: ArraySource<T>) {
  const value = from(source);
  return value[delta % value.length];
}

function from<T>(source?: ArraySource<T>): T[] {
  return source == null
    ? []
    : Array.isArray(source)
    ? source
    : isArrayLike(source) || isIterable(source)
    ? Array.from(source)
    : [];
}

function last<T>(source?: ArraySource<T>) {
  return at(-1, source);
}

function lastIndex<T>(source?: ArraySource<T>) {
  return array.from(source).length - 1;
}

function reverse<T>(source?: ArraySource<T>) {
  return from(source)?.slice()?.reverse();
}

function clone<T>(source?: ArraySource<T>) {
  return from(source)?.slice() ?? [];
}

export function isArrayLike<T>(source?: unknown): source is ArrayLike<T> {
  return source != null && typeof (source as ArrayLike<T>)?.length === 'number';
}

export function isIterable<T>(source?: unknown): source is Iterable<T> {
  return typeof (source as Iterable<T>)?.[Symbol.iterator] === 'function';
}

/**
 * from regimen
 */
function size<T>(v?: T[] | null | undefined) {
  return v?.length ?? 0;
}

function some<T>(...allConditions: Condition<T>[]) {
  const conditioner: Condition<T> = (v, i, c) => {
    return allConditions.some(cond => cond(v, i, c));
  };

  return (source?: ArraySource<T>) => array.from(source).some(conditioner);
}

function none<T>(...allConditions: Condition<T>[]) {
  const conditioner = array.some(...allConditions);

  return (source?: ArraySource<T>) => !conditioner(source);
}

function isEmpty<T extends any[] | null | undefined>(v?: T): v is T {
  return array.size(v) < 1;
}

function isNonEmpty<T extends any[] | null | undefined>(v?: T): v is T {
  return !array.isEmpty(v);
}
