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
