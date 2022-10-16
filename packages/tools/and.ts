export const and = {
  k: andK,
  key: andK,
  v: andV,
  value: andV,
};

/**
 * andV — an "and gate" for a collection Value
 *
 * Will return value if found as a Value of source
 */
export function andV<T extends string>(source: T[], value?: T) {
  if (value == null) return;

  return Array.isArray(source)
    ? source.includes(value)
      ? value
      : undefined
    : Object.values(source as Record<string, T>).includes(value)
    ? value
    : undefined;
}

/**
 * andK — an "and gate" for a collection Key
 *
 * Will check for presence as element of an array
 */
export function andK<T extends string>(source: unknown, value?: T) {
  if (value == null) return;

  return value in (source as Record<T, unknown>) ? value : undefined;
}
