import { createTimeout, createTimer } from '@bffr/tools';
import { useEffect, useReducer } from 'react';

export type Phase = 'idle' | 'entering' | 'pending' | 'leaving';

const defaultEdges: { [key in Phase]?: number } = {
  entering: 200,
  pending: 100,
  leaving: 200,
};

// a teeny tiny transistion map
const phaseMap: Record<Phase, (undefined | Phase)[]> = {
  idle: ['idle', 'entering', undefined],
  entering: ['leaving', undefined, 'pending'],
  pending: ['leaving', undefined, 'leaving'],
  leaving: [undefined, 'entering', 'idle'],
};

export function useAnimationPhase(loading: boolean, edges = defaultEdges) {
  const [mode, next] = useReducer(
    (phase: Phase, loading: undefined | boolean): Phase =>
      // we map loading state to an index to get the next phase
      phaseMap[phase][loading == null ? 2 : loading ? 1 : 0] ?? phase,
    // start in the correct state
    loading ? 'entering' : 'idle',
  );

  // begin or end loading
  useEffect(() => next(loading), [loading]);
  useEffect(() => {
    const duration = edges?.[mode] ?? defaultEdges[mode];
    // setting a duration of zero will trigger the timeout
    return duration == null
      ? next(undefined)
      : createTimeout(() => next(undefined), duration);
  }, [mode, edges[mode]]);

  return mode;
}
