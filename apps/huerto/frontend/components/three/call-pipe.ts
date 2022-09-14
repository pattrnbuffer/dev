import { isFunction } from 'lodash';

export type AnyFunc = (...args: any[]) => any;

const $ref = Symbol();

export type CallPipe<T extends AnyFunc = AnyFunc> = {
  (...args: Parameters<T>): void;
  [$ref]: Set<T>;
  add: (handle: Pipet<T>) => CallPipe<T>;
};

type Pipet<T extends AnyFunc> = T | CallPipe<T>;

export const CallPipe = {
  create: createCallPipe,
  assign: assignCallPipes,
  from: callPipeFrom,
  guard: isCallPipe,
};

export function createCallPipe<T extends AnyFunc>(
  ref?: CallPipe<T>,
): CallPipe<T> {
  const set = new Set<T>(isCallPipe(ref) ? ref[$ref] : undefined);

  const pipe = Object.assign(
    (...args: Parameters<T>) => set.forEach(handle => handle(...args)),
    {
      [$ref]: set,
      type: 'pipe',
      add(handle: Pipet<T>) {
        if (isCallPipe(handle)) {
          handle[$ref].forEach(v => set.add(v as T));
        } else if (typeof handle === 'function') {
          set.add(handle as T);
        } else {
          console.warn('Value ignored in call pipe', handle);
        }

        return pipe;
      },
    },
  );

  return pipe;
}

function isCallPipe<T extends AnyFunc>(value?: unknown): value is CallPipe<T> {
  return value != null && typeof value === 'object' && $ref in value;
}

export function assignCallPipes<
  A extends readonly Record<string, Pipet<AnyFunc>>[],
>(source: any, ...rest: A): Record<string, CallPipe<AnyFunc>>;

export function assignCallPipes<
  A extends readonly Record<string, Pipet<AnyFunc>>[],
>(...[props, ...rest]: A) {
  return rest.reduce(
    (result, record) => {
      for (const [key, fn] of Object.entries(record))
        result[key] = callPipeFrom(result[key]).add(fn);

      return result;
    },
    { ...props },
  );
}

export function callPipeFrom<T extends AnyFunc>(value?: Pipet<T>) {
  return <CallPipe<T>>(
    (typeof value !== 'function'
      ? createCallPipe()
      : isCallPipe(value)
      ? createCallPipe(value)
      : createCallPipe().add(value))
  );
}
