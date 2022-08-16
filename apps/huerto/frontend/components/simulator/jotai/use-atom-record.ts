import { Atom, atom, useAtom } from 'jotai';
import { useMemo } from 'react';

export function useAtomRecord<
  V,
  K extends string | symbol,
  T extends Record<K, V>,
>(source: Atom<T>, key: K) {
  return useAtom(
    useMemo(() => {
      return atom(get => get(source)[key]);
    }, [source, key]),
  );
}
