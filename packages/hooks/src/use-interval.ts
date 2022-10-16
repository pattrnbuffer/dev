import { useMemo } from 'react';

import { MountedRef } from './use-mounted-ref';
import { useReferenceCallback } from './use-referenced-callback';
import { useTrigger } from './use-trigger';

/**
 * TODO: test for interval.then().then().then() chains stabily and correctly
 */
export function useInterval(
  duration: number,
  callback?: (mounted: MountedRef) => unknown,
) {
  const handler = useReferenceCallback(callback);

  const [_, restart] = useTrigger(
    mounted => {
      const id = setInterval(
        mounted.guard(() => handler?.(mounted)),
        duration,
      );

      return () => clearInterval(id);
    },
    [duration],
  );

  return useMemo(() => ({ restart }), [restart]);
}
