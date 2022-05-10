import { useEffect, useRef, EffectCallback } from 'react';

export type EffectSet = [
  gate: <T>(prev: T) => T | boolean,
  effect: EffectCallback,
];

type ValueSet = Record<number, unknown>;

export function useEffectSets(...series: EffectSet[]) {
  const ref = useRef<ValueSet>([]);

  const next = series.map(([gate], vi) => gate(ref.current[vi]));

  useEffect(() => {
    ref.current = next;

    const effects = series.map(([, effect], vi) => {
      if (next[vi]) return effect();
    });

    return () => effects.forEach(end => end?.());
  }, next);
}
