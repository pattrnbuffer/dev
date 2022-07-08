import { DependencyList, useEffect } from 'react';
import { MountedRef, useMountedRef } from './use-mounted-ref';

export type MountedEffectCallback = (
  mounted: MountedRef,
) => void | (() => void);

export function useMountedEffect(
  effect: MountedEffectCallback,
  deps: DependencyList,
  //
  stage?: { observe: 'effect' },
): void;

export function useMountedEffect(
  effect: MountedEffectCallback,
  deps?: DependencyList,
  stage?: { observe: 'mount' | 'effect' | 'render' },
) {
  const ref = useMountedRef(
    observe(stage?.observe ?? 'mount', deps),
    // { mount: [], dependency: deps, render: null }[stage?.observe ?? 'mount'],
  );

  useEffect(() => effect(ref), deps);
}

export const observe: // | ((on: 'mount') => undefined)
// | ((on: 'effect', deps: DependencyList) => undefined | DependencyList)
// | ((on: 'render') => null) =
(
  on: 'mount' | 'effect' | 'render',
  deps?: DependencyList,
) => undefined | null | DependencyList = (on, deps) => {
  return { mount: [], effect: deps, render: null }[on];
};
