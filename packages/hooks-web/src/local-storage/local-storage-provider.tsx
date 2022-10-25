import get from 'lodash/get';
import set from 'lodash/set';
import toPath from 'lodash/toPath';
import { FC, ReactNode, useEffect } from 'react';
import { createContainer } from 'react-tracked';
import { useImmer } from 'use-immer';

import * as LocalStorage from './local-storage';

export const LocalStorageProvider: FC<{
  path: string;
  children: ReactNode;
}> = ({ path, children }) => {
  return (
    <LocalStorageState.Provider key={path} path={path}>
      <LocalStorageStateSync />
      {children}
    </LocalStorageState.Provider>
  );
};

export const LocalStorageState = createContainer(
  ({ path: input }: { path: string }) => {
    return useImmer(() => {
      const [key, ...path] = toPath(input);

      return { key, path, value: LocalStorage.read(key) };
    });
  },
);

const LocalStorageStateSync: FC = () => {
  const [key, path] = LocalStorageState.useSelector(state => [
    state.key,
    state.path,
  ]);
  const update = LocalStorageState.useSelector(state => get(state, path));

  useEffect(() => {
    LocalStorage.write(key, set(LocalStorage.read(key), path, update));
  }, [update]);

  return null;
};
