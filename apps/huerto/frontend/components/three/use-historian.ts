import { isFunction } from 'lodash';
import {
  DependencyList,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type Entry<T> = {
  value: T;
  timestamp: number;
  createdAt: string;
};

export type History<T> = Entry<T>[];

type Ref<T> = { current: History<T> };

export function useHistorian<T>(
  varied: T | ((history: History<T>) => T),
  deps?: DependencyList,
): History<T> {
  const history = useQuietHistorian(varied, deps);

  return useMemo(() => [...history.current], [history.current.length]);
}

export function useQuietHistorian<T>(
  varied: T | ((history: History<T>) => T),
  deps?: DependencyList,
) {
  const ref: Ref<T> = useRef([]);
  const value = isFunction(varied) ? varied(ref.current) : varied;

  // use react dependency management, but execute immediately
  useMemo(() => {
    if (value != null) {
      ref.current.push(createEntry(value));
    }
  }, deps ?? [value]);

  return ref;
}

const createEntry = <T>(value: T) => ({
  value: value,
  timestamp: Date.now(),
  createdAt: new Date().toISOString(),
});
