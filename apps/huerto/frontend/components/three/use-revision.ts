import { SetStateAction, useMemo, useReducer, useState } from 'react';
import { isFunction } from 'lodash';

type Prefix = string | ((version: number) => string);

export function useRevision<T>(
  revise: (prev?: T, next?: T) => T,
  prefix?: Prefix,
) {
  const [state, setState] = useState({
    version: 1,
    value: revise?.(),
  });

  return useMemo(() => {
    return {
      ...state,
      id: identify(prefix, state.version),
      commit(valuate: SetStateAction<T>) {
        setState(prev => {
          const next = {
            version: prev.version + 1,
            value: revise(
              prev.value,
              isFunction(valuate) ? valuate(prev.value) : valuate,
            ),
          };

          return prev.value === next.value ? prev : next;
        });
      },
    };
  }, [identify(prefix, state.version)]);
}

const identify = (prefix: undefined | Prefix, version: number) =>
  `${
    prefix == null
      ? version
      : typeof prefix === 'function'
      ? prefix(version)
      : [prefix, version].join(':')
  }`;
