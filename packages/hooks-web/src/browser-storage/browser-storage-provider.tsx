import * as jotai from 'jotai';
import { FC, ReactNode } from 'react';

export const scope = Symbol();
export const storageAtom = jotai.atom<Record<string, any>>({});
export const configAtom = jotai.atom<Record<string, any>>({
  prefix: 'bs',
});

export const BrowserStorageProvider: FC<{ children?: ReactNode }> = props => {
  return (
    <jotai.Provider
      {...props}
      initialValues={[[storageAtom, {}]]}
      scope={scope}
    />
  );
};
