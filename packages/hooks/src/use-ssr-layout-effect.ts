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
    // @ts-expect-error: we don't provide a dom lib
    typeof window === 'undefined' ? useEffect : useLayoutEffect;

  useHook(effect, deps);
}
