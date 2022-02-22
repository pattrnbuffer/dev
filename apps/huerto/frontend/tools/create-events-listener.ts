type EventName = 'mousemove' | 'mouseenter';

/**
 * TODO: refactor to use repo:hooks/create-event-listener
 */
export function createEventsListener(
  eventName: EventName | EventName[],
  callback: (event: MouseEvent) => unknown,
  options?: AddEventListenerOptions,
) {
  const allEventNames: EventName[] = Array.isArray(eventName)
    ? eventName
    : [eventName];

  for (const ev of allEventNames) {
    document.addEventListener(ev, callback, options);
  }

  return () => {
    for (const ev of allEventNames) {
      document.removeEventListener(ev, callback);
    }
  };
}
