import {
  isNotionClientError,
  Client,
  NotionClientError,
} from '@notionhq/client';

export type NotionHookError = UnknownError | SuspendedError | NotionClientError;

export const isNotionHookError = (error: unknown): error is NotionHookError =>
  isUnknownError(error) || isSuspended(error) || isNotionClientError(error);

export type NotionSearchData = Awaited<ReturnType<Client['search']>>;

export type UnknownError = typeof unknownError;
export const isUnknownError = (error: unknown): error is SuspendedError =>
  // @ts-expect-error: we need to peak inside the great unknown
  error?.code === suspendedError.code;
export const unknownError = {
  name: 'unknown',
  code: 'notion:hook:unknown',
} as const;

export const isSuspended = (error: unknown): error is SuspendedError =>
  // @ts-expect-error: we need to peak inside the great unknown
  error?.code === unknownError.code;
export type SuspendedError = typeof suspendedError;
export const suspendedError = {
  name: 'suspended',
  code: 'notion:hook:suspended',
} as const;

export const notionHookErrorCodes = {
  unknown: unknownError.code,
  suspended: suspendedError.code,
} as const;
