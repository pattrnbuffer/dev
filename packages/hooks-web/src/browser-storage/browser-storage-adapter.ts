import { JSON } from './txs';

type Storage = globalThis.Storage;
type MethodNames = 'setItem' | 'getItem' | 'removeItem' | 'clear';
type Fallback<K extends MethodNames, T = string> = (
  ...args: Parameters<Storage[K]>
) => T | undefined;

export const LocalStorage = createBrowserStorageAdapter(
  isBrowserStorageAvailable('local')
    ? (window.localStorage as Storage)
    : undefined,
);

export const SessionStorage = createBrowserStorageAdapter(
  isBrowserStorageAvailable('session')
    ? (window.sessionStorage as Storage)
    : undefined,
);

export const StorageAdapters = {
  local: LocalStorage,
  session: SessionStorage,
} as const;

export function createBrowserStorageAdapter(source?: Storage, tx = JSON) {
  source ??= {} as Storage;
  const { getItem, setItem, removeItem, clear } = new Proxy(source, {
    get: (target, key: MethodNames) => target?.[key]?.bind(target),
  });

  return {
    set: (key: string, value: string, fallback: Fallback<'setItem'>) =>
      setItem ? setItem(key, tx.stringify(value)!) : fallback(key, value),

    get: (key: string, fallback: Fallback<'getItem'>) =>
      getItem ? tx.parse(getItem(key)) ?? undefined : fallback(key),

    remove: (key: string, fallback: Fallback<'removeItem'>) =>
      removeItem ? removeItem(key) : fallback(key),

    clear: (fallback: Fallback<'clear'>) =>
      // next line please
      clear ? clear() : fallback(),
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
