import { isFunction } from 'lodash';
import { DependencyList, useEffect, useMemo, useRef, useState } from 'react';
import { useEffectActions } from './use-effect-actions';
import { useVersionId } from './use-version-id';

/**
 *
 * TODO: move to trunk and bookmarks
 */
export function useCommits<T>(
  value?: T | ((head: T[], index: number) => T),
  deps?: DependencyList,
) {
  const { id, bump } = useVersionId();

  const ref = useRef<{ commited: T[]; staged: T[] }>({
    commited: [],
    staged: [],
  });

  // provide direct value support
  useEffect(() => {
    if (value != null) {
      bump();
      ref.current.commited.push(
        unwrap(value, [
          [...ref.current.commited, ...ref.current.staged],
          ref.current.commited.length - 1,
        ]),
      );
    }
  }, deps ?? [value]);

  const actions = useEffectActions({
    pull() {
      bump();
      ref.current = {
        commited: [...ref.current.commited, ...ref.current.staged],
        staged: [],
      };
    },

    revert() {
      bump();
      ref.current = {
        commited: [],
        staged: [],
      };
    },
  });

  return useMemo(
    () => ({
      id,

      ...actions,
      push(value: T) {
        ref.current.staged.push(value);
        return value!;
      },

      get history() {
        return ref.current.commited;
      },

      get head() {
        return [...ref.current.commited, ...ref.current.staged];
      },
    }),
    // recreate reference on value reset
    [ref.current],
  );
}

function unwrap<T, A extends any[]>(v: T | ((...args: A) => T), args?: A): T {
  args ??= [] as unknown as A;

  return isFunction(v) ? v(...args) : v;
}
