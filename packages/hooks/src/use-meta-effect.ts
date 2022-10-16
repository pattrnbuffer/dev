import { useEffect, useState, DependencyList } from 'react';
import { isPromise } from '@bffr/tools';
import { useMountedRef, MountedRef } from './use-mounted-ref';

export type MetaEffectCallback<T> = (mounted: MountedRef) => EffectReturn<T>;
type EffectReturn<T> = Destructor | Promise<T> | [T | Promise<T>, Destructor];
type Destructor = (() => void) | void | undefined;

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
      data.then(mounted.guard(setValue));
    } else if (data) {
      setValue(data);
    }

    return destructor;
  }, deps);

  return value;
}
