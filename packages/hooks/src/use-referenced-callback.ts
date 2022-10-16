import { useCallback, useRef } from 'react';
import { useSSRLayoutEffect } from './use-ssr-layout-effect';

export function useReferenceCallback<T extends (...args: any[]) => any>(
  fn?: T,
) {
  const ref = useRef(fn);

  useSSRLayoutEffect(() => {
    ref.current = fn;
  }, [fn]);

  return useCallback((...args: Parameters<T>) => {
    // unlike useEvent, this returns …
    return ref.current?.(...args);
  }, []);
}

export { useReferenceCallback as useCallbackRef };
