import { func } from './func';

type PromiseValue<T> = Promise<T> | (() => Promise<T>);

export const promise = {
  all: mapPromise,
  follow: followPromise,
};

export function mapPromise<T, R>(
  list: T[],
  op: (item: T, index: number, source: typeof list) => R | Promise<R>,
) {
  return Promise.all(list.map(op));
}

type Ref<T> = { current?: T } & Promise<T>;
export async function followPromise<T, U>(
  source: PromiseValue<T>,
  sink: (ref: Ref<T>, source: Promise<T>) => U,
): Promise<[T, U]> {
  source = func.value(source);

  const ref: Ref<T> = source.then(value => {
    ref.current = value;
    return value;
  });

  return Promise.all([source, sink(ref, source)]);
}
