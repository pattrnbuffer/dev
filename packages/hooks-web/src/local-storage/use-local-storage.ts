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
  const [state, setState] = [
    LocalStorageState.useSelector<T>(ctx => get(ctx.value, basepath)),
    LocalStorageState.useUpdate(),
  ];
  useEffect(() => setState(state => state ?? fallback), []);

  return [
    state ?? fallback,
    (...$: [T] | [string, T]) => {
      setState(state => {
        const [path, value] = <[string[], T]>(
          ($.length < 2 ? [[], $[0]] : [toPath($[0]), $[1]])
        );

        return path.length === 0 ? value : set(state, path, value);
      });
    },
  ];
}
