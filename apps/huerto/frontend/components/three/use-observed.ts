import { useMemo } from 'react';
import { KeyOf } from '~/frontend/types';
import { CallPipe, createCallPipe } from './call-pipe';

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

  type State = {
    [T in Entries[number] as T[0]]: T[1];
  };

  type Handlers = {
    [k in keyof Entries[number][2]]: CallPipe<Entries[number][2][k] | AnyFunc>;
  };

  const observed = observers.map(useObserved => useObserved());
  const observation = observed.reduce(
    (prev, observed) => {
      return {
        state: Object.assign(prev.state, {
          [observed.key]: observed.state,
        }),
        handlers: Object.entries(observed.handlers).reduce(
          (handlers, [name, receiver]) => {
            // instantiate and add receiver
            (handlers[name as KeyOf<Handlers>] =
              handlers[name] ?? createCallPipe()).add(receiver);

            return handlers;
          },
          prev.handlers,
        ),
      };
    },
    { state: {}, handlers: {} } as Observation<State, Handlers>,
  );

  return useMemo(() => observation, Object.values(observation.state));
}

function flat<
  A extends Observation<Record<string, any>, Record<string, CallPipe<AnyFunc>>>,
>(observed: A[]) {
  observed.reduce(
    (merged, next) => {
      // merge state
      Object.assign(merged.state, next.state);

      // merged callbacks
      for (const [name, pipe] of Object.entries(next.handlers)) {
        merged.handlers[name] ??= createCallPipe();
        merged.handlers[name].add(pipe);
      }

      return merged;
    },
    { state: {}, handlers: {} } as A,
  );
}
