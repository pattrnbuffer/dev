import { func } from '@dev/tools';

export const all = <T, R>(
  list: T[],
  op: (item: T, index: number, source: typeof list) => R | Promise<R>,
) => Promise.all(list.map(op));

type Ref<T> = { current?: T };
export async function siphon<T, U>(
  source: Promise<T> | (() => Promise<T>),
  sink: (ref: Ref<T>) => U,
): Promise<[T, U]> {
  const ref: Ref<T> = {};

  source = func.value(source);
  source.then(v => (ref.current = v));

  return [await source, await sink(ref)];
}

export { prom } from '@dev/tools';
