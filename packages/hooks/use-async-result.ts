import { useState } from 'react';
import { useAsyncEffect } from './use-async-effect';

export type AsyncRequest<D, E> = () => Promise<AsyncResponse<D, E>>;

export type AsyncResponse<D, E = string> =
  | { ok: true; data: D }
  | { ok: false; error?: E };

export type AsyncResult<D, E = string> =
  | { status: 'pending'; data?: D }
  | { status: 'rejected'; data?: D; error?: E }
  | { status: 'resolved'; data: D };

export function useAsyncResult<D, E>(
  request: AsyncRequest<D, E>,
): [result: AsyncResult<D, E>, refresh: () => void] {
  // triggers provide a trivial solution for rerequests
  const [trigger, setTrigger] = useState(0);
  const [result, setResult] = useState<AsyncResult<D, E>>({
    status: 'pending',
  });

  useAsyncEffect(
    async mounted => {
      setResult(({ data }) => ({ status: 'pending', data }));

      const resp = await request().catch(() => undefined);

      mounted() &&
        setResult(({ data }) =>
          resp?.ok
            ? { status: 'resolved', data: resp.data || (data as D) }
            : { status: 'rejected', data: data, error: resp?.error },
        );
    },
    [request, trigger],
  );

  return [result, () => setTrigger(v => v + 1)];
}
