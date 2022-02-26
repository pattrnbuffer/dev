export const promise = {
  all: mapPromise,
  follow: followPromise,
};

export function mapPromise<T, R>(
  list: T[],
  op: (item: T, index: number, source: typeof list) => R | Promise<R>,
) {
  Promise.all(list.map(op));
}

type Ref<T> = { current?: T };
export async function followPromise<T, U>(
  source: Promise<T>,
  sink: (ref: Ref<T>) => U,
): Promise<[T, U]> {
  const ref: Ref<T> = {};
  source.then(v => (ref.current = v));

  return [await source, await sink(ref)];
}
