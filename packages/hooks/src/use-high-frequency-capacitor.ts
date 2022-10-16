import { useEffect, useState, useRef } from 'react';
import { useEvent } from './use-event';

export function useHighFrequencyCapacitor<T, I = any>(
  identify: (v?: T) => I | undefined,
  value?: T,
  size = 100,
) {
  const capacitor = useRef<T[]>([]);

  const [flush, setFlush] = useState(false);
  const [history, setHistory] = useState(
    value && identify(value) ? [value] : [],
  );

  const onValue = useEvent((value?: T) => {
    if (!value || !identify(value) || history[0] === value) return;

    setFlush(() => {
      capacitor.current.push(value);
      return true;
    });
  });

  const onRemove = useEvent((filter?: (v: T) => boolean) => {
    if (filter) setHistory(hist => hist.filter(v => !filter(v)));
  });

  // passively acquired values aren't supported for high frequency
  // useEffect(() => onValue(value), [value]);

  useEffect(() => {
    if (!flush) return;

    setFlush(false);

    const { current } = capacitor;
    capacitor.current = [];

    setHistory(hist => {
      hist = current.reduce((hist, value) => {
        const index = history.findIndex(v => identify(value) === identify(v));

        return index < 0
          ? [value, ...hist]
          : [...hist.slice(0, index), value, ...hist.slice(index + 1)];
      }, hist);

      return hist.slice(0, size);
    });
  }, [flush]);

  return [history, onValue, onRemove] as const;
}
