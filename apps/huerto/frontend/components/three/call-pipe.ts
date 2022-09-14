import { isFunction } from 'lodash';

export type AnyFunc = (...args: any[]) => any;

const $ref = Symbol();

export type CallPipe<T extends AnyFunc> = {
  (...args: Parameters<T>): void;
  [$ref]: Set<T>;
  add: (handle: T) => CallPipe<T>;
};

export function createCallPipe<T extends AnyFunc>(): CallPipe<T> {
  const set = new Set<T>();

  const pipe = Object.assign(
    (...args: Parameters<T>) => set.forEach(handle => handle(...args)),
    {
      [$ref]: set,
      type: 'pipe',
      add(handle: T | CallPipe<T>) {
        if (isCallPipe(handle)) {
          handle[$ref].forEach(v => set.add(v as T));
        } else {
          set.add(handle as T);
        }

        return pipe;
      },
    },
  );

  return pipe;
}

function isCallPipe<T extends AnyFunc>(value?: unknown): value is CallPipe<T> {
  return value != null && $ref in value;
}
