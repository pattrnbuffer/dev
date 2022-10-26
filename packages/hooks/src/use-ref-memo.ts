import { DependencyList, useMemo, useRef } from 'react';

export function useRefMemo<T>(update: (ref?: T) => T, deps?: DependencyList) {
  const ref = useRef<T>(undefined!);
  ref.current = useMemo(() => update(ref.current), deps);

  return ref;
}
