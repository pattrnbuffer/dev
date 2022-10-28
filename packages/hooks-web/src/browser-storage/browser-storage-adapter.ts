import { JSON, Tx } from './txs';

type Storage = globalThis.Storage;
type MethodNames = 'setItem' | 'getItem' | 'removeItem' | 'clear';
type Fallback<
  K extends MethodNames,
  T = never,
  P extends any[] = Parameters<Storage[K]>,
> = (...args: P) => T extends never ? ReturnType<Storage[K]> : T;

export type StorageKind = keyof typeof storage;

export const storage = {
  local: createBrowserStorageAdapter(
    isBrowserStorageAvailable('local')
      ? (window.localStorage as Storage)
      : undefined,
  ),
  session: createBrowserStorageAdapter(
    isBrowserStorageAvailable('session')
      ? (window.sessionStorage as Storage)
      : undefined,
  ),
} as const;

export function createBrowserStorageAdapter(source?: Storage, tx = JSON) {
  source ??= {} as Storage;
  const { getItem, setItem, removeItem, clear } = new Proxy(source, {
    get: (target, key: MethodNames) => target?.[key]?.bind(target),
  });

  return {
    set: <T>(k: string, v: T, fb?: Fallback<'setItem', void, [string, T]>) =>
      setItem ? setItem(k, tx.stringify(v)!) : fb?.(k, v),

    get: <T>(k: string, fb?: Fallback<'getItem', [string, T]>) =>
      getItem ? tx.parse(getItem(k)) ?? undefined : fb?.(k),

    remove: (k: string, fb?: Fallback<'removeItem'>) =>
      removeItem ? removeItem(k) : fb?.(k),

    clear: (fallback?: Fallback<'clear'>) =>
      // next line please
      clear ? clear() : fallback?.(),
  };
}

function isBrowserStorageAvailable(type: 'session' | 'local') {
  const storageKey = `${type}Storage` as const;
  const testKey = '__browser_storage_test_key__';
  try {
    // Safari's private mode will throw on setItem
    window[storageKey].setItem(testKey, 'succeeds');
    window[storageKey].removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}
