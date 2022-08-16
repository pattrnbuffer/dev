type Awaited<T> = T extends Promise<infer V> ? Awaited<V> : T;
type Getter = {
  <Value>(atom: Atom<Value | Promise<Value>>): Value;
  <Value>(atom: Atom<Promise<Value>>): Value;
  <Value>(atom: Atom<Value>): Awaited<Value>;
};
type WriteGetter = Getter & {
  <Value>(
    atom: Atom<Value | Promise<Value>>,
    options: {
      unstable_promise: true;
    },
  ): Promise<Value> | Value;
  <Value>(
    atom: Atom<Promise<Value>>,
    options: {
      unstable_promise: true;
    },
  ): Promise<Value> | Value;
  <Value>(
    atom: Atom<Value>,
    options: {
      unstable_promise: true;
    },
  ): Promise<Awaited<Value>> | Awaited<Value>;
};
type Setter = {
  <Value, Result extends void | Promise<void>>(
    atom: WritableAtom<Value, undefined, Result>,
  ): Result;
  <Value, Update, Result extends void | Promise<void>>(
    atom: WritableAtom<Value, Update, Result>,
    update: Update,
  ): Result;
};
type Read<Value> = (get: Getter) => Value;
type Write<Update, Result extends void | Promise<void>> = (
  get: WriteGetter,
  set: Setter,
  update: Update,
) => Result;
type WithInitialValue<Value> = {
  init: Value;
};
export type Scope = symbol | string | number;
export type SetAtom<
  Update,
  Result extends void | Promise<void>,
> = undefined extends Update
  ? (update?: Update) => Result
  : (update: Update) => Result;
type OnUnmount = () => void;
type OnMount<Update, Result extends void | Promise<void>> = <
  S extends SetAtom<Update, Result>,
>(
  setAtom: S,
) => OnUnmount | void;
export interface Atom<Value> {
  toString: () => string;
  debugLabel?: string;
  read: Read<Value>;
}
export interface WritableAtom<
  Value,
  Update,
  Result extends void | Promise<void> = void,
> extends Atom<Value> {
  write: Write<Update, Result>;
  onMount?: OnMount<Update, Result>;
}
type SetStateAction<Value> = Value | ((prev: Value) => Value);
export type PrimitiveAtom<Value> = WritableAtom<Value, SetStateAction<Value>>;

export function atom<Value, Update, Result extends void | Promise<void> = void>(
  read: Read<Value>,
  write: Write<Update, Result>,
): WritableAtom<Value, Update, Result>;

export function atom<Value>(read: Read<Value>): Atom<Value>;

export function atom(
  invalidFunction: (...args: any) => any,
  write?: any,
): never;

export function atom<Value, Update, Result extends void | Promise<void> = void>(
  initialValue: Value,
  write: Write<Update, Result>,
): WritableAtom<Value, Update, Result> & WithInitialValue<Value>;

export function atom<Value>(
  initialValue: Value,
): PrimitiveAtom<Value> & WithInitialValue<Value>;
export {};

/////////////////////////

export function useAtom<Value, Update, Result extends void | Promise<void>>(
  atom: WritableAtom<Value, Update, Result>,
  scope?: Scope,
): [Awaited<Value>, SetAtom<Update, Result>];

export function useAtom<Value>(
  atom: Atom<Value>,
  scope?: Scope,
): [Awaited<Value>, never];
export {};
