import {
  useEffect,
  useCallback,
  useState,
  EffectCallback,
  DependencyList,
} from 'react';

export function useTrigger(effect: EffectCallback, deps: DependencyList = []) {
  const [fire, setFire] = useState(0);
  useEffect(effect, [fire, ...deps]);
  return useCallback(() => setFire(pulls => pulls + 1), []);
}
