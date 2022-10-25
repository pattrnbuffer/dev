import { Dispatch, SetStateAction } from 'react';

export let pretty = true;
export const setPretty = () => (pretty = true);

export function read(key: string) {
  let text = window.localStorage.get(key);
  if (text != null) {
    try {
      return JSON.parse(text);
    } catch (e) {}
  }
}

export function write<T>(key: string, value: T) {
  window.localStorage.set(
    key,
    pretty ? JSON.stringify(value, null, 2) : JSON.stringify(value),
  );
}
