import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useRef,
} from 'react';

export const RootMode = Symbol();

type IdentityMap<T> = (update?: T, state?: T, mode?: symbol) => T;

export function createIdentityLayer<T>(identityOf: IdentityMap<T>) {
  const IdentityLayerContext = createContext<T>(
    identityOf(undefined, undefined, RootMode),
  );

  const IdentityLayer: FC<{
    children: ReactNode;
    map: (update?: T, reduced?: T) => T;
  }> = ({ children, map }) => {
    map ??= identityOf;

    const context = useContext(IdentityLayerContext);
    const identity = Object.assign(useRef<ReturnType<typeof map>>(), {
      current: useMemo(() => map(context, identity.current), [context]),
    });

    return (
      <IdentityLayerContext.Provider value={identity.current}>
        {children}
      </IdentityLayerContext.Provider>
    );
  };

  function useIdentityLayer() {
    return useContext(IdentityLayerContext);
  }

  return [IdentityLayer, useIdentityLayer] as const;
}
