import { isNumber, createTimeout } from '@dev/tools';
import { DependencyList, useMemo, useState } from 'react';

import { useMountedEffect } from './use-mounted-effect';

type BounceEvent = {
  duration: number;
  startedAt: number;
  updatedAt: number;
};

export function useBounceResult<T = unknown>(
  onTimeout: (event: BounceEvent) => T,
  duration: number,
  threshold?: number | null,
  deps?: DependencyList,
) {
  const [result, setResult] = useState<T>();
  const startedAt = useMemo(() => Date.now(), [result]);

  useMountedEffect(
    mounted => {
      const updatedAt = Date.now();
      const duration = updatedAt - startedAt;
      const done = () =>
        setResult(onTimeout({ duration, startedAt, updatedAt }));

      return isNumber(threshold) && duration > threshold
        ? done()
        : createTimeout(mounted.guard(done), duration);
    },
    [duration, threshold, ...(deps ?? [])],
    { observe: 'effect' },
  );

  return result;
}
