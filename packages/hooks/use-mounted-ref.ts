import { useEffect, useMemo, useRef } from 'react';

export type MountedRef = ReturnType<typeof useMountedRef>;

export function useMountedRef() {
  const state = useRef(true);

  useEffect(
    () => () => {
      state.current = false;
    },
    [],
  );

  return useMemo(() => {
    const mounted = () => state.current;

    mounted.commit = <R>(call: () => R) => {
      if (state.current) return call();
    };

    mounted.guard =
      <Args extends any[], Fn extends (...args: Args) => any>(callback: Fn) =>
      (...params: Args) =>
        mounted.commit(() => callback(...params));

    /** @deprecated */
    mounted.callback = mounted.guard;

    return mounted;
  }, []);
}
