import { useState } from 'react';
import { KeyOf, ValueOf } from '~/frontend/types';

type AnyFunc = (...args: any[]) => any;

export type Observation<
  T extends Record<string, any>,
  H extends Record<string, AnyFunc>,
> = {
  state: T;
  handlers: H;
};

export type ObservedHook<S, K extends string, R extends Record<string, any>> = (
  record?: R,
) => Observed<S, K>;

export type Observed<S, K extends string> = {
  key: K;
  state: S;
  handlers: Record<string, AnyFunc>;
};

type ZipTuple<T extends readonly any[], U extends readonly any[]> = {
  [K in keyof T]: [T[K], K extends keyof U ? U[K] : never];
};

export function useObserved<A extends readonly ObservedHook<any, any, any>[]>(
  observers: A,
) {
  type Entries = {
    [I in keyof A]: [
      ReturnType<A[I]>['key'],
      ReturnType<A[I]>['state'],
      ReturnType<A[I]>['handlers'],
    ];
  };

  type Merged = Observation<
    { [T in Entries[number] as T[0]]: T[1] },
    { [k in keyof Entries[number][2]]: EventPipe<Entries[number][2][k]> }
  >;

  const observed = observers.map(useObserved => useObserved());
  return observed.reduce(
    (prev, observed) => {
      return {
        state: Object.assign(prev.state, { [observed.key]: observed.state }),
        handlers: Object.entries(observed.handlers).reduce(
          (handlers, [name, handle]) => {
            const eventPipe =
              (handlers[name] as EventPipe<typeof handle>) ??
              createEventPipe<typeof handle>();

            handlers[name as KeyOf<Merged['handlers']>] =
              eventPipe.include(handle);

            return handlers;
          },
          prev.handlers,
        ),
      };
    },
    { state: {}, handlers: {} } as Merged,
  ) as Merged;
}

type EventPipe<T extends AnyFunc> = {
  (...args: Parameters<T>): void;
  include: (handle: T) => EventPipe<T>;
};

function createEventPipe<T extends AnyFunc>(): EventPipe<T> {
  const set = new Set<T>();

  const pipe = Object.assign(
    (...args: Parameters<T>) => set.forEach(handle => handle(...args)),
    {
      include(handle: T) {
        set.add(handle);
        return pipe;
      },
    },
  );

  return pipe;
}
