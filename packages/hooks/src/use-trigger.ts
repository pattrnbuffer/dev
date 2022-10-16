import { useCallback, useState, DependencyList } from 'react';
import { useMetaEffect, MetaEffectCallback } from './use-meta-effect';

export function useTrigger<T>(
  effect: MetaEffectCallback<T>,
  deps: DependencyList = [],
) {
  const [fire, setFire] = useState(0);

  return [
    useMetaEffect(effect, [fire, ...deps]),
    useCallback(() => setFire(pulls => pulls + 1), []),
  ] as const;
}
