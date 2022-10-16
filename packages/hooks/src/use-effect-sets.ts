import { useEffect, useRef, EffectCallback } from 'react';

export type EffectSet = [
  gate: <T>(prev: T | unknown) => boolean | unknown,
  effect: EffectCallback,
];

type ValueSet = Record<number, unknown>;

export function useEffectSets(...series: EffectSet[]) {
  const ref = useRef<ValueSet>([]);
  const next = series.map(([gate], vi) => gate(ref.current[vi]));

  useEffect(() => {
    const prev = ref.current;
    ref.current = next;

    const effects = series.map(([, effect], vi) => {
      if (typeof next[vi] === 'boolean' ? next[vi] : next[vi] !== prev[vi])
        return effect();
    });

    return () => effects.forEach(end => end?.());
  }, next);
}
