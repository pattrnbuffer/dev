import { useEffect, DependencyList } from 'react';
import { useMountedRef, MountedRef } from './use-mounted-ref';

export type MountedEffectCallback = (
  mounted: MountedRef,
) => void | (() => void);

export function useMountedEffect(
  effect: MountedEffectCallback,
  deps?: DependencyList,
) {
  const ref = useMountedRef();

  useEffect(() => {
    return effect(ref);
  }, deps);
}
