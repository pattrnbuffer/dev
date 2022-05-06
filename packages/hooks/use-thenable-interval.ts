import { useMemo } from 'react';
import { MountedRef } from './use-mounted-ref';
import { useReferenceCallback } from './use-referenced-callback';
import { useTrigger } from './use-trigger';

type Then<T> = PromiseLike<T>['then'];

/**
 * TODO: test for interval.then().then().then() chains stabily and correctly
 */
export function useInterval(
  duration: number,
  callback?: (mounted: MountedRef) => unknown,
) {
  const handler = useReferenceCallback(callback);

  const [thenable, restart] = useTrigger(
    (mounted): [Then<MountedRef>, () => void] => {
      let resolve: (value: MountedRef) => void;

      const promise = new Promise<MountedRef>(next => (resolve = next));
      const id = setInterval(
        mounted.callback(() => {
          handler?.(mounted);
          resolve?.(mounted);
        }),
        duration,
      );

      return [thenFor(mounted, promise), () => clearInterval(id)];
    },
    [duration],
  );

  return useMemo<{ then: Then<MountedRef>; restart: () => void }>(
    () => ({
      restart: restart,
      // TODO: this doesn't work
      then(resolve, reject) {
        if (thenable == null) {
          throw new Error('Unexpected null promise');
        }

        return thenable(resolve, reject);
      },
    }),
    [thenable, restart],
  );
}

/**
 * TODO: test for reference stability
 * Is the reference of then().then().then() unchanged — it should be
 */
function thenFor<T>(mounted: MountedRef, promise?: PromiseLike<T>): Then<T> {
  let fulfill: Parameters<Then<T>>[0];
  let reject: Parameters<Then<T>>[1];

  const thenable = {
    get then() {
      return thenFor(
        mounted,
        promise?.then(
          mounted.callback((arg: T) => fulfill?.(arg)),
          mounted.callback((reason: unknown) => reject?.(reason)),
        ),
      );
    },
  };

  return (onfulfilled, onrejected) => {
    fulfill = onfulfilled;
    reject = onrejected;

    return thenable;
  };
}
