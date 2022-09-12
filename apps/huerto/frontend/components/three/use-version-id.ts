import { useMemo, useReducer, useState } from 'react';

type Prefix = string | ((version: number) => string);

export function useVersionId(prefix?: Prefix) {
  const [version1, bump] = useReducer(v => {
    console.log(v + 1);
    return v + 1;
  }, 0);
  const [version, setVersion] = useState(1);

  return useMemo(() => {
    const _ = {
      version,
      id: identify(prefix, version),
      bump: () => setVersion(v => v + 1),
      commit: (callback: () => void) => {
        _.bump();
        // TODO stage commit in effect or state update?
        callback();
      },
    };

    return _;
  }, [identify(prefix, version)]);
}

const identify = (prefix: undefined | Prefix, version: number) =>
  `${
    prefix == null
      ? version
      : typeof prefix === 'function'
      ? prefix(version)
      : [prefix, version].join(':')
  }`;
