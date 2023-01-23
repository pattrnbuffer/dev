import { useEffect, useState } from 'react';
import { createIdleCallback, CreateIdleCallbackProps } from '@bffr/tools';

export type UseIdleValueProps<T = unknown> = CreateIdleCallbackProps<any> & {
  equality?: (a: T, b: T) => boolean;
};
/**
 * A hacky substitute for useDeferredValue in React 18
 * @param value anything you want
 * @returns everything you need
 */
export function useIdleValue<T>(
  value: T,
  { equality, ...props }: UseIdleValueProps<T>,
) {
  const equal = (equality ??= useIdleValue.defaults.equality);
  const [deferred, setDeferred] = useState(value);

  useEffect(() => {
    if (!equal(deferred, value)) {
      return createIdleCallback(() => setDeferred(value), props);
    }
  }, [value]);

  return deferred;
}
useIdleValue.defaults = {
  equality: <T>(a: T, b: T) => a === b,
};
