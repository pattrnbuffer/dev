import { useEffect, useMemo, useRef, RefObject, DependencyList } from 'react';

export type MountedRef = ReturnType<typeof useMountedRef>;

/**
 * A toolbelt for mount phases
 * - deps: undefined => mounted with component
 * - deps: null => mounted per render
 * - deps: [...] => mounted per effect
 */
export function useMountedRef(deps?: undefined | null | DependencyList) {
  const state = useRef(true);

  useEffect(
    () => () => {
      state.current = false;
    },
    // we assume our mount state tracks the component
    // to track each render we pass null as a signal
    // otherwise we track effect state
    deps === undefined ? [] : deps === null ? undefined : deps,
  );

  return useMemo(() => createMountedRef(state), []);
}

export function createMountedRef(state: RefObject<Boolean>) {
  const mounted = () => state.current;

  const commit = <R>(call: () => R) => {
    if (mounted()) return call();
  };

  const guard =
    <Args extends any[], Fn extends (...args: Args) => any>(callback: Fn) =>
    (...params: Args) =>
      commit(() => callback(...params));

  return Object.assign(mounted, { commit, guard });
}
