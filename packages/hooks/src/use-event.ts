import { useCallback, useRef } from 'react';
import { useSSRLayoutEffect } from './use-ssr-layout-effect';

export type EventHandler<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => void;

export function useEvent<T extends (...args: any[]) => any>(
  on?: T,
): EventHandler<T> {
  const ref = useRef(on);

  useSSRLayoutEffect(() => {
    ref.current = on;
  }, [on]);

  return useCallback((...args: Parameters<T>) => {
    ref.current?.(...args);
  }, []);
}
