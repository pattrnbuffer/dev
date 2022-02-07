type CacheRef = {
  id: string;
  object: string;
  [key: string]: unknown;
};

const invalid = 'invalid';

export const cache = {
  store: {} as Record<string, unknown>,

  key(ref: CacheRef) {
    return ref?.object && ref?.id ? `${ref.object}/${ref.id}` : invalid;
  },
  get<T>(ref: CacheRef) {
    return cache.store[cache.key(ref)] as T;
  },
  set<T extends CacheRef>(val: T) {
    if (cache.key(val) !== invalid) {
      cache.store[cache.key(val)] = val;
    }

    return val;
  },

  resolveFor<T extends CacheRef, V extends (...args: any[]) => Promise<T>>(
    object: string,
    resolve: V,
  ) {
    return <V>(
      (async (...args) =>
        cache.get({ object, id: args[0] ?? '' }) ??
        resolve(...args).then(result => cache.set<T>(result)))
    );
  },

  resolveForMany<
    T extends CacheRef,
    V extends (...args: any[]) => Promise<T[]>,
  >(object: string, resolve: V) {
    return <V>(
      (async (...args) =>
        cache.get({ object, id: args[0] ?? '' }) ??
        resolve(...args).then(result => result.map(v => cache.set(v))))
    );
  },
};
