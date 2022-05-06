import { useEffect, useState } from 'react';
import { useEvent } from './use-event';

export function useCapacitor<T, I = T[keyof T]>(
  identify: (v?: T) => I | undefined,
  value?: T,
  size = 10,
) {
  const [history, setHistory] = useState(
    value && identify(value) ? [value] : [],
  );

  const onValue = useEvent((value?: T) => {
    if (!value || !identify(value) || history[0] === value) return;

    setHistory(hist => {
      const index = history.findIndex(v => identify(value) === identify(v));

      hist =
        index < 0
          ? [value, ...hist]
          : [...hist.slice(0, index), value, ...hist.slice(index + 1)];

      return hist.slice(0, size);
    });
  });

  const onRemove = useEvent((filter?: (v: T) => boolean) => {
    if (filter) setHistory(hist => hist.filter(v => !filter(v)));
  });

  useEffect(() => onValue(value), [value]);

  return [history, onValue, onRemove] as const;
}
