export type Tx = {
  parse<T>(value: unknown): T | undefined;
  stringify<T>(value: T): string | undefined;
};

export const StringTx = {
  parse: _ => _,
  stringify: _ => String(_),
};

export const JSONTx = {
  parse<T>(value: unknown) {
    try {
      if (typeof value === 'string') return JSON.parse(value) as T;
    } catch (e) {}
  },
  stringify<T>(value: T, pretty?: boolean) {
    try {
      return pretty
        ? JSON.stringify(value)
        : JSON.stringify(value, undefined, 2);
    } catch (e) {}
  },
};

export { JSONTx as JSON };
