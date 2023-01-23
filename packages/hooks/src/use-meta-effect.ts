import { useEffect, useState, DependencyList } from 'react';
import { isPromise } from '@bffr/tools';
import { useMountedRef, MountedRef } from './use-mounted-ref';

export type MetaEffectCallback<T> = (mounted: MountedRef) => EffectReturn<T>;
type EffectReturn<T> = Destructor | Promise<T> | [T | Promise<T>, Destructor];
type Destructor = (() => void) | void | undefined;

/**
 * A value returning effect
 * … I guess meta was for sharing an ongoing process? 🤔
 *
 * @param effect () => value | destructor | [value, destructor]
 * @param deps [changes to effect] or nothing
 * @returns
 */
export function useMetaEffect<T>(
  effect: MetaEffectCallback<T>,
  deps?: DependencyList,
) {
  const [value, setValue] = useState<T>();
  const mounted = useMountedRef();

  useEffect(() => {
    const result = effect(mounted);

    const [data, destructor] = Array.isArray(result)
      ? result
      : typeof result === 'function'
      ? [undefined, result]
      : [result];

    if (isPromise(data)) {
      data?.then(mounted.guard(setValue));
    } else if (data) {
      setValue(data);
    }

    return destructor;
  }, deps);

  return value;
}
