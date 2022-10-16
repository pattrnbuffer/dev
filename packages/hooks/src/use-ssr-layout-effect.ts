import {
  useEffect,
  useLayoutEffect,
  EffectCallback,
  DependencyList,
} from 'react';

export function useSSRLayoutEffect(
  effect: EffectCallback,
  deps?: DependencyList,
) {
  let useHook =
    typeof window === 'undefined' ? useEffect : useLayoutEffect;

  useHook(effect, deps);
}
