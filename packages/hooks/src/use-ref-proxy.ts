import { useEffect, useMemo, useRef } from 'react';

type Data = Record<string | number | symbol, any>;
type Strategy = 'instant' | 'effect' | 'none';

export function useRefProxy<T extends Data>(data: T, strategy: Strategy): T {
  const ref = useManagedRef(data, strategy);

  return useMemo(
    () =>
      new Proxy(data, {
        get(_, key) {
          return ref.current[key];
        },
      }),
    [Object.keys(data).join()],
  );
}

export function useManagedRef<T>(data: T, strategy: Strategy = 'effect') {
  const ref = useRef(data);

  if (strategy === 'instant') {
    ref.current = data;
  }

  useEffect(() => {
    if (strategy === 'effect') {
      ref.current = data;
    }
  }, [data]);

  return ref;
}
