export function map<T, K extends string, R = T>(
  source: Record<K, T>,
  callback: (value: T, key: K) => R,
) {
  return Object.entries(source).map(([key, value]) =>
    callback(value as T, key as K),
  );
}
