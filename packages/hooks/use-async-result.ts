import { useState } from 'react';
import { useAsyncEffect } from './use-async-effect';

export type AsyncRequest<D, E> = () => Promise<AsyncResponse<D, E>>;

export type AsyncResponse<D, E = string> =
  | { ok: true; data: D }
  | { ok: false; error?: E };

export type AsyncResult<D, E = string> =
  | { status: 'pending'; value?: AsyncResponse<D, E>; data?: D }
  | { status: 'rejected'; value?: AsyncResponse<D, E>; data?: D; error?: E }
  | { status: 'resolved'; value: AsyncResponse<D, E>; data: D };
// https://en.wikipedia.org/wiki/Result_type
// https://adambennett.dev/2020/05/the-result-monad/
export function useAsyncResult<D, E = unknown>(
  request: AsyncRequest<D, E>,
): [result: AsyncResult<D, E>, refresh: () => void] {
  // triggers provide a trivial solution for rerequests
  const [trigger, setTrigger] = useState(0);
  const [result, setResult] = useState<AsyncResult<D, E>>({
    status: 'pending',
  });

  useAsyncEffect(
    async mounted => {
      setResult(({ data: data }) => ({ status: 'pending', data: data }));

      // const resp = await request().catch(() => undefined);
      const [error, response] = await request()
        .then(value => [undefined, value] as const)
        .catch((error: E) => [error, undefined] as const);

      mounted() &&
        setResult(prev =>
          response?.ok
            ? {
                status: 'resolved',
                value: response,
                data: response.data,
              }
            : {
                value: response,
                status: 'rejected',
                data: prev.data,
                error: response?.error ?? error,
              },
        );
    },
    [request, trigger],
  );

  return [result, () => setTrigger(v => v + 1)];
}
