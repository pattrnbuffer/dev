import { useEffect, DependencyList } from 'react';
import { useMountedRef, MountedRef } from './use-mounted-ref';

export function useAsyncEffect<T>(
  effect: (mounted: MountedRef) => Promise<T>,
  deps?: DependencyList,
) {
  const ref = useMountedRef();

  useEffect(() => {
    effect(ref);
  }, deps);
}
