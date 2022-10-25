import get from 'lodash/get';
import set from 'lodash/set';
import toPath from 'lodash/toPath';
import { FC, ReactNode, useEffect } from 'react';
import { createContainer } from 'react-tracked';
import { useImmer } from 'use-immer';

import * as LocalStorage from './local-storage';

const LocalState = createContainer(({ path: input }: { path: string }) => {
  return useImmer(() => {
    const [key, ...path] = toPath(input);

    return { key, path, value: LocalStorage.read(key) };
  });
});

export const LocalStorageProvider: FC<{
  path: string;
  children: ReactNode;
}> = ({ path, children }) => {
  return (
    <LocalState.Provider key={path} path={path}>
      <SyncLocalStorage />
      {children}
    </LocalState.Provider>
  );
};

const SyncLocalStorage: FC = () => {
  const [key, path] = LocalState.useSelector(state => [state.key, state.path]);
  const update = LocalState.useSelector(state => get(state, path));

  useEffect(() => {
    LocalStorage.write(key, set(LocalStorage.read(key), path, update));
  }, [update]);

  return null;
};

export function useLocalStorage<T>(
  basepath: string,
  fallback?: T,
): [
  value: T | undefined,
  write: ((value: T) => void) | ((path: string, value: T) => void),
] {
  const [value, setValue] = [
    LocalState.useSelector<T>(ctx => get(ctx.value, basepath)) ?? fallback,
    LocalState.useUpdate(),
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
