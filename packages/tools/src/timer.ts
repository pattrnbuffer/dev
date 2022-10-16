export function createTimeout(fn: () => unknown, duration: number) {
  const id = setTimeout(fn, duration);

  return () => void clearTimeout(id);
}

export function createInterval(fn: () => unknown, duration: number) {
  const id = setInterval(fn, duration);

  return () => void clearInterval(id);
}

type Timer<T> = (fn: () => unknown, duration: number) => T;

/**
 * I guess I  was bored
 */
function createTimer<T>(
  set: Timer<T>,
  clear: (v: T) => unknown,
): Timer<() => void> {
  // returns createTimer(fn, duration)
  return (fn: () => unknown, duration: number) => {
    const id = set(fn, duration);

    return () => void clear(id);
  };
}

// const createTimeout = createTimer(setTimeout, clearTimeout);
// const createInterval = createTimer(setInterval, clearInterval);
