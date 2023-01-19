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
export function createIdleCallback(callback: () => unknown) {
  // not supported by all browsers or environments
  // @ts-expect-error: window this window that
  if (window?.requestIdleCallback != null) {
    // @ts-expect-error: window this window that
    let id = window.requestIdleCallback(() => callback?.(), { timeout });
    // @ts-expect-error: window this window that
    return () => window.cancelIdleCallback(id);
  } else {
    let id = setTimeout(callback, timeout);
    return () => clearTimeout(id);
  }
}
