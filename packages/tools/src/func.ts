import { G } from '@mobily/ts-belt';

export const func = {
  value: valueFromFn,
  apply,
};

export function valueFromFn<T>(callable: T | (() => T)) {
  return G.isFunction(callable) ? callable() : callable;
}

export function apply<R, T extends (...args: any) => R>(
  fn: T,
  params?: unknown,
  scope?: unknown,
  fallback?: R,
) {
  if (typeof fn === 'function') {
    try {
      return fn.apply(scope, Array.isArray(params) ? params : []);
    } catch (e) {}
  }

  return fallback;
}
