export function map<T, K extends string, R = T>(
  source: Record<K, T>,
  callback: (value: T, key: K) => R,
) {
  return Object.entries(source).map(([key, value]) =>
    callback(value as T, key as K),
  );
}

export const round = (value: number, significance: number = 100) =>
  Math.round(100 * value) / 100;

export const floor = (value: number, significance: number = 100) =>
  Math.floor(100 * value) / 100;
