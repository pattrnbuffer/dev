export const guard = {
  for: guardFor,
};

export function guardFor<T>(
  value: unknown,
  guard?: (value: unknown) => boolean,
): value is T {
  return value ? guard?.(value) ?? true : false;
}

export function typeOf<Type, Guard extends (v: unknown) => v is Type>(
  guard: Guard | { typeOf: Guard },
  v: unknown,
) {
  return (typeof guard === 'function' ? guard : guard.typeOf)(v);
}
