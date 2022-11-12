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
