export type Timer<T> = (fn: () => unknown, duration: number) => T;

export const createTimeout = createTimer(setTimeout, clearTimeout);
export const createInterval = createTimer(setInterval, clearInterval);

export function createTimer<T>(
  set: Timer<T>,
  clear: (v: T) => unknown,
): Timer<() => void> {
  // returns createTimer(fn, duration)
  return (fn: () => unknown, duration: number) => {
    const id = set(fn, duration);

    return () => void clear(id);
  };
}

const timeout = 4 * 16;
const requestIdleCallback = window?.requestIdleCallback;

type CreateIdleCallbackProps<T> = IdleRequestOptions & {
  fallback?: (effect: T, options: IdleRequestOptions) => () => void;
};

export function createIdleCallback<T extends IdleRequestCallback>(
  effect: T,
  { fallback, ...options }: CreateIdleCallbackProps<T> = {},
) {
  // not supported by all browsers or environments
  if (requestIdleCallback != null) {
    const id = requestIdleCallback(a => effect?.(a), { timeout, ...options });
    return () => window.cancelIdleCallback(id);
  }
  // takes optional fallback
  else if (typeof fallback === 'function') {
    const timer = fallback(effect, options);
    // requires the fallbacks to return a timer cancelation
    if (typeof timer !== 'function')
      throw new Error(
        'createIdleCallback expected a cancelation `() => void` be returned from fallback',
      );
    else return timer;
  }
  // otherwise defaults to setTimeout
  else {
    const id = setTimeout(effect, timeout);
    return () => clearTimeout(id);
  }
}
