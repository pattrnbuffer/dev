import { useEffect, useMemo, useRef } from 'react';

export function useDestruct() {
  const destructors = useRef<((...args: any[]) => any)[]>([]);

  useEffect(
    () => () => void destructors.current.forEach(destruct => destruct()),
    [],
  );

  return useMemo(
    () => (destruct: () => unknown) => void destructors.current.push(destruct),
    [],
  );
}
