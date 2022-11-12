import { G } from '@mobily/ts-belt';

export const noop = (...args: any) => {};

export const identity = <T>(v: T) => v;

export function valueOf<T extends any>(callable: T | (() => T)) {
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

export const func = {
  noop,
  identity,
  apply,
  value: valueOf,
  valueOf,
};
