export function foxy<T>(value: Promise<T>): Promise<T> & {
  [k in keyof Awaited<typeof value>]: Awaited<typeof value>[k] extends (
    ...args: infer P
  ) => infer R
    ? (...args: P) => Promise<R>
    : () => Promise<Awaited<typeof value>[k]>;
} {
  const promised =
    value instanceof Promise || typeof value?.['then'] === 'function'
      ? value
      : Promise.resolve(value);

  return new Proxy(promised, handler) as any;
}

const handler = {
  get<T>(future: Promise<T>, key: keyof T) {
    type Source = Awaited<typeof future>;

    return (
      ...args: Source[typeof key] extends (...args: infer P) => any ? P : []
    ) => {
      return future.then(resolved => {
        const fx = resolved?.[key];
        return typeof fx !== 'function' ? fx : fx.apply(resolved, args);
      });
    };
  },
};
