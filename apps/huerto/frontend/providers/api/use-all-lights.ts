import { useCallbackRef } from '@dev/hooks';
import { ResultType } from '@dev/tools';
import { fetch } from '@evanrs/fetch';
import { useEffect, useState } from 'react';
import type { AllLightsResponseData } from '~/pages/api/hue/all-lights';

export type AllLightsResult = AllLightsResponseData;

export type AllLightsRequest = {
  type: 'pending' | 'resolved' | 'rejected';
  data?: AllLightsResponseData;
  error?: { message: string };
};

export function useAllLights(
  onDone?: (v: AllLightsRequest & { type: 'resolved' | 'rejected' }) => void,
) {
  const [data, setData] = useState<AllLightsRequest>({ type: 'pending' });

  const onRequest = useCallbackRef(async () => {
    // setData(data => ({ ...data, type: 'pending' }));

    const response = await fetch<AllLightsResponseData>(`/api/hue/all-lights`);

    // TODO: use response.headers['content-type'] to avoid catch
    const [error, data] = await response
      .json()
      .then(data => [undefined, data] as const)
      .catch(error => [error, undefined] as const);

    const result =
      data == null
        ? ({ type: 'rejected', response, error } as const)
        : ({ type: 'resolved', response, data } as const);

    setData(result);
    onDone?.(result);
  });

  useEffect(onRequest, []);

  return [data, onRequest] as const;
}
