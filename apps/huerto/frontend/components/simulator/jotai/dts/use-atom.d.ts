import { Awaited, Atom, Scope, SetAtom, WritableAtom } from './atom';

export function useAtom<Value, Update, Result extends void | Promise<void>>(
  atom: WritableAtom<Value, Update, Result>,
  scope?: Scope,
): [Awaited<Value>, SetAtom<Update, Result>];

export function useAtom<Value>(
  atom: Atom<Value>,
  scope?: Scope,
): [Awaited<Value>, never];
export {};
