/**
 * Further API
 *
 * Not possible with property accessor value is converted to string
 *
 * somePromise[{
 *  retry(op, error, context) {
 *    if (context.calls > 3) throw error
 *
 *    return context.backoff(() => op(someModifierValue))
 *  }
 * }]
 *
 * somePromise.someProperty.sumFn()[{
 *  capture(error, someProperty, key = "sumFn", context) {
 *    if (error is "real-bad") throw error
 *
 *    // other wise lets return a fallback
 *    return someProperty.sumOtherFn
 *  }
 * }]
 */
type Fox<P> = Promise<Awaited<P>> & {
  [k in keyof Awaited<P>]: Awaited<P>[k] extends (...args: infer P) => infer R
    ? (...args: P) => Fox<Promise<R>>
    : () => Fox<Promise<Awaited<P>[k]>>;
};

export function foxy<T>(value: Promise<T>): Fox<typeof value> {
  const promised =
    value instanceof Promise || typeof value?.['then'] === 'function'
      ? value
      : Promise.resolve(value);

  return new Proxy(promised, handler) as any;
}

const handler = {
  get<T>(future: Promise<T>, key: keyof T, receiver: Promise<T>) {
    type Source = Awaited<typeof future>;

    return (
      ...args: Source[typeof key] extends (...args: infer P) => any ? P : []
    ) => {
      if (key === 'then') return future.then;
      if (key === 'catch') return future.catch;
      if (key === 'finally') return future.finally;

      console.log('foxied', key);

      const promise = future.then(resolved => {
        const fx = resolved?.[key];
        return typeof fx !== 'function' ? fx : fx.apply(resolved, args);
      });

      promise.then(result => console.log({ result }));

      return foxy(promise);
    };
  },
};

// export function foxied<T, Params extends []>(
//   forward: (...args: Params) => Promise<T | void>,
// ) {
//   return (...args: Parameters<typeof forward>) => {
//     return foxy(forward(...args));
//   };
// }

// https://stackoverflow.com/questions/44441259/determining-if-get-handler-in-proxy-object-is-handling-a-function-call
// const handler = new Proxy(
//   {
//     apply(target, thisArg, argsList) {
//       // something was invoked, so return custom array
//       return [value, name, receiver, argsList];
//     },
//     get(target, property) {
//       // a property was accessed, so wrap it in a proxy if possible
//       const { writable, configurable } = Object.getOwnPropertyDescriptor(
//         target,
//         property,
//       ) || { configurable: true };
//       return writable || configurable
//         ? watch(value === object ? value[property] : undefined, property)
//         : target[property];
//     },
//   },
//   {
//     get(handler, trap) {
//       if (trap in handler) {
//         return handler[trap];
//       }
//       // reflect intercepted traps as if operating on original value
//       return (target, ...args) => Reflect[trap].call(handler, value, ...args);
//     },
//   },
// );
