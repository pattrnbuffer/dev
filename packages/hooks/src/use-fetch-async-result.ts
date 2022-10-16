import { useMemo } from 'react';
import { useAsyncResult } from './use-async-result';

export type FetchResult<D> =
  | { status: 'pending'; url?: string; data?: D }
  | { status: 'rejected'; url: string; data?: D; error?: string }
  | { status: 'resolved'; url: string; data: D };

export function useAsyncResultFetch<D>(url: string) {
  const [result, retry] = useAsyncResult<D>(async () => {
    const response = await fetch(url).catch(() => undefined);

    return response?.ok
      ? { ok: true, data: await response.json() }
      : { ok: false };
  });

  return useMemo(() => {
    return result.status === 'pending'
      ? [{ ...result, url }, () => {}]
      : [{ ...result, url }, retry];
  }, [result]);
}
