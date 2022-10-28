import { atom, useAtom, useAtomValue } from 'jotai';
import _get from 'lodash/get';
import _set from 'lodash/set';
import { useMemo } from 'react';
import { storage, StorageKind } from './browser-storage-adapter';
import { configAtom, scope, storageAtom } from './browser-storage-provider';

export function useBrowserStorage<T>(key: string, type: StorageKind = 'local') {
  const config = useAtomValue(configAtom, scope);
  const path = [type, config.prefix, key].filter(Boolean).join(':');
  const adapter = storage[type];

  return useAtom(
    useMemo(() => {
      const selectAtom = atom(
        (gt): T => _get(gt(storageAtom), path) ?? adapter.get(path),
        (gt, st, update: T) => {
          st(storageAtom, _set({ ...gt(storageAtom) }, path, update));
          adapter.set(path, update);
        },
      );
      selectAtom.onMount = st => st(adapter.get(path) as T);

      return selectAtom;
    }, [path]),
  );
}
