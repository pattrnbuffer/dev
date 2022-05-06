import { func } from './func';

type PromiseValue<T> = Promise<T> | (() => Promise<T>);
type PromiseRef<T> = { current?: T } & Promise<T>;

export const promise = {
  all: mapPromise,
  follow: followPromise,
  instance: isPromise,
  like: isPromiseLike,
};

export function mapPromise<T, R>(
  list: T[],
  op: (item: T, index: number, source: typeof list) => R | Promise<R>,
) {
  return Promise.all(list.map(op));
}

export async function followPromise<T, U>(
  source: PromiseValue<T>,
  sink: (ref: PromiseRef<T>, source: Promise<T>) => U,
): Promise<[T, U]> {
  source = func.value(source);

  const ref: PromiseRef<T> = source.then(value => {
    ref.current = value;
    return value;
  });

  return Promise.all([source, sink(ref, source)]);
}

export function isPromise<T>(data: T | Promise<T>): data is Promise<T> {
  return (
    isPromiseLike(data) &&
    'catch' in data &&
    typeof data.catch === 'function' &&
    'finally' in data &&
    typeof data.finally === 'function'
  );
}

export function isPromiseLike<T>(
  data: T | PromiseLike<T>,
): data is PromiseLike<T> {
  return Boolean(data) && 'then' in data && typeof data.then === 'function';
}
