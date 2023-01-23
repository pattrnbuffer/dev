export type CreateIdleCallbackProps<
  T extends IdleRequestCallback = IdleRequestCallback,
> = IdleRequestOptions & {
  fallback?: (effect: T, options: IdleRequestOptions) => () => void;
};

const requestIdleCallback = window?.requestIdleCallback;

export function createIdleCallback<T extends IdleRequestCallback>(
  effect: T,
  { fallback, ...options }: CreateIdleCallbackProps<T> = {},
) {
  options = { timeout: createIdleCallback.timeout, ...options };

  // not supported by all browsers or environments
  if (requestIdleCallback != null) {
    const id = requestIdleCallback(a => effect?.(a), options);
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
    const id = setTimeout(effect, options.timeout);
    return () => clearTimeout(id);
  }
}
/**
 * Defaults to 8/60 animation frames per second — a 14% loss rate
 */
createIdleCallback.timeout = 8 * 16;
