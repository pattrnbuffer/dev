import { useMemo, useRef, DependencyList } from 'react';

export function useMemoTransition<T>(
  factory: (prev?: T) => T,
  deps: DependencyList | undefined
): T {
  const value = useRef<T | undefined>();

  return useMemo(() => {
    return (value.current = factory(value.current));
  }, deps);
}
