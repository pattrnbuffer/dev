import _get from 'lodash/get';
import _set from 'lodash/set';
import _toPath from 'lodash/toPath';
import { FC, ReactNode, useEffect } from 'react';
import { createContainer } from 'react-tracked';
import { useImmer } from 'use-immer';

import * as ls from './local-storage';

const LocalState = createContainer(({ path: input }: { path: string }) => {
  return useImmer(() => {
    const [key, ...path] = _toPath(input);

    return { key, path, value: ls.read(key) };
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
  const update = LocalState.useSelector(state => _get(state, path));

  useEffect(() => {
    ls.write(key, _set(ls.read(key), path, update));
  }, [update]);

  return null;
};

export function useLocalStorageState<T>(
  basepath: string,
): [
  value: T | undefined,
  write: ((value: T) => void) | ((path: string, value: T) => void),
] {
  const value = LocalState.useSelector(({ value }) => _get(value, basepath));
  const setValue = LocalState.useUpdate();

  return [
    value,
    (...{ 0: a, 1: b, length }: [T] | [string, T]) => {
      setValue(state => {
        const [path, value] = length < 2 ? [[], a as T] : [_toPath(a), b as T];

        return path.length === 0 ? value : _set(state, path, value);
      });
    },
  ];
}
