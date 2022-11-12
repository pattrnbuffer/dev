export const object = {
  key: objectKeys,
  own,
  keyOf,
};

export function objectKeys<T extends Record<string, any>>(obj: T) {
  return Object.keys(obj) as any as (keyof T extends string
    ? keyof T
    : never)[];
}

export function own<T extends Record<any, any>>(obj: T) {
  return Object.getOwnPropertyNames(obj).reduce((acc, key: keyof T) => {
    acc[key] = obj[key];
    return acc;
  }, {} as T);
}

export function keyOf<U extends Record<any, any>>(
  source: U,
  key?: unknown,
): key is keyof U {
  return typeof key === 'string' && key in source;
}

export function updatePath<T>(target: T, path: string[], update: any) {
  path.reduce((node, key, index, { [index + 1]: next }) => {
    if (!next) node[key] = update;

    return node[key];
  }, target as any);
}

export function bind<T extends object>(target: T) {
  return new Proxy<T>(target, {
    get(source, key) {
      const value = source?.[key as keyof T];
      return typeof value === 'function' ? value.bind(source) : value;
    },
  });
}
