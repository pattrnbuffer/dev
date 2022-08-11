import { useState, useEffect, useReducer, EffectCallback } from 'react';

type PhaseState = { phase: number; destructors: Destructor[] };
type PhaseChange =
  | { type: 'continuation'; destructor?: Destructor }
  | { type: 'invocation' };

type Destructor = ReturnType<EffectCallback>;

export function usePhasedEffect(phases: EffectCallback[], deps: [] = []) {
  const [{ phase, destructors }, dispatch] = useReducer(
    (state: PhaseState, change: PhaseChange) => {
      if (change.type === 'invocation') {
        state = { phase: 0, destructors: [] };
      }

      if (change.type === 'continuation') {
        state = { ...state, phase: state.phase + 1 };
        if (change.destructor)
          state.destructors = [...state.destructors, change.destructor];
      }

      return state;
    },
    { phase: 0, destructors: [] },
  );

  useEffect(() => {
    // TODO: is there a liminal case?
    if (phase > 0) {
      dispatch({ type: 'invocation' });
      destructors.forEach(destructor => destructor?.());
    }
  }, deps);

  useEffect(() => {
    if (phase < phases.length) {
      const destructor = phases[phase]();
      dispatch({ type: 'continuation', destructor });
    }
  }, [phase]);

  return { stage: phase >= phases.length ? 'idle' : 'pending' };
}
