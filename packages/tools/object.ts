export const object = {
  key: objectKeys,
};

export function objectKeys<T extends Record<string, any>>(obj: T) {
  return Object.keys(obj) as any as (keyof T extends string
    ? keyof T
    : never)[];
}
