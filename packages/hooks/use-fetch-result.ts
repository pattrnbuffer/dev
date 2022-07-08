import { fetch } from '@evanrs/fetch';
import { useState } from 'react';
import { useAsyncEffect } from './use-async-effect';

export type FetchResult<D> =
  | { status: 'pending'; data?: D }
  | { status: 'rejected'; data?: D; error?: string }
  | { status: 'resolved'; data: D };

export function useFetchResult<D>(url: string) {
  // triggers provide a trivial solution for rerequests
  const [trigger, setTrigger] = useState(0);
  const [result, setResult] = useState<FetchResult<D>>({
    status: 'pending',
  });

  useAsyncEffect(
    async mounted => {
      setResult(current => ({
        status: 'pending',
        data: current.data,
      }));

      const response = await fetch<D>(url).catch(() => undefined);
      const data = response?.ok ? await response.json() : undefined;

      mounted() &&
        setResult(current => ({
          status: response?.ok ? 'resolved' : 'rejected',
          data: (data || current.data) as D,
        }));
    },
    [trigger],
  );

  return [result, () => setTrigger(v => v + 1)] as const;
}
