import { guardFor } from './guard';

export type JSONParseProps<T> = {
  guard?: (value: unknown) => boolean;
  fallback?: T;
};

export const json = {
  parse<T>(text: string, props?: JSONParseProps<T>) {
    let value: T | undefined;

    try {
      value = JSON.parse(text);
    } catch (e) {}

    return guardFor<T>(value) ? value : props?.fallback;
  },

  string: (...args: Parameters<typeof JSON.stringify>) =>
    JSON.stringify(...args),
};
