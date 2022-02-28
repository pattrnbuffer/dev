export const guard = {
  for: guardFor,
};

export function guardFor<T>(
  value: unknown,
  guard?: (value: unknown) => boolean,
): value is T {
  return value ? guard?.(value) ?? true : false;
}
