import { G } from '@mobily/ts-belt';

export const func = {
  value: valueFromFn,
};

export function valueFromFn<T>(callable: T | (() => T)) {
  return G.isFunction(callable) ? callable() : callable;
}
