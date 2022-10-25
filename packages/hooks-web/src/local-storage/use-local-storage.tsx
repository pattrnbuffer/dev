import get from 'lodash/get';
import set from 'lodash/set';
import toPath from 'lodash/toPath';
import { useEffect } from 'react';
import { LocalStorageState } from './local-storage-provider';

export function useLocalStorage<T>(
  basepath: string,
  fallback?: T,
): [
  value: T | undefined,
  write: ((value: T) => void) | ((path: string, value: T) => void),
] {
  const [value, setValue] = [
    LocalStorageState.useSelector<T>(ctx => get(ctx.value, basepath)) ??
      fallback,
    LocalStorageState.useUpdate(),
  ];
  useEffect(() => setValue(state => state ?? fallback), []);

  return [
    value,
    (...{ 0: a, 1: b, length }: [T] | [string, T]) => {
      setValue(state => {
        const [path, value] = length < 2 ? [[], a as T] : [toPath(a), b as T];

        return path.length === 0 ? value : set(state, path, value);
      });
    },
  ];
}
