import ky from 'ky';
import { useEffect, useState, useMemo } from 'react';
import { isNotionClientError, Client } from '@notionhq/client';

import {
  unknownError,
  suspendedError,
  NotionHookError,
  SuspendedError,
  NotionSearchData,
  isSuspended,
} from './errors-types';

export const useNotionClient = ({ token }: { token: string }) => {
  const client = useMemo(() => new Client({ fetch: ky, auth: token }), [token]);

  const [store, setStore] = useState({
    databases: [],
    pages: [],
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      let result = await client.search({
        filter: { property: 'object', value: 'database' },
      });

      const databases = await result;
      console.log('put in store', { databases });
    })();

    return () => {
      mounted = false;
    };
  }, [client]);

  useEffect(() => {
    client.search({ filter: { property: 'object', value: 'database' } });
  }, [client]);

  return client;
};

type NotionHookResponse<Data> =
  | [error?: NotionHookError, data?: undefined]
  | [error?: undefined | SuspendedError, data?: Data];

export const useNotionSearch = (
  client: Client,
  ...args: Parameters<Client['search']>
): NotionHookResponse<NotionSearchData> => {
  const [error, setError] = useState<NotionHookError>();
  const [data, setData] = useState<NotionSearchData>();

  useEffect(() => {
    let mounted = true;

    setError(suspendedError);

    client
      .search({
        filter: { property: 'object', value: 'database' },
      })
      .then(resp => {
        if (mounted) {
          setError(undefined);
          setData(() => resp);
        }
      })
      .catch(error => {
        if (mounted) {
          setError(isNotionClientError(error) ? error : unknownError);
          setData(undefined);
        }
      });

    return () => {
      mounted = false;
    };
  }, [client]);

  // return [
  //   error != null ? error : data == null ? suspendedError : undefined,
  //   isSuspended(error) ? data : data != null ? data : undefined,
  // ];

  return isSuspended(error)
    ? [error, data]
    : isNotionClientError(error)
    ? [error, undefined]
    : data != null
    ? [undefined, data]
    : [undefined, undefined];
};
