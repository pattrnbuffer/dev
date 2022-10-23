import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useMemo,
  useRef,
} from 'react';

type LayerIdValue = number | string | symbol;

const LayerIdContext = createContext<LayerIdValue>(0);

export type LIFC<T, U = T> = FC<{
  map: (update: T, reduced: U | undefined) => U;
  children: ReactNode;
}>;

export const LayerId: LIFC<LayerIdValue> = ({ children, map }) => {
  const context = useContext(LayerIdContext);
  const state = Object.assign(useRef<ReturnType<typeof map>>(), {
    current: useMemo(() => map(context, state.current), [context]),
  });

  return (
    <LayerIdContext.Provider value={state.current}>
      {children}
    </LayerIdContext.Provider>
  );
};

export function useLayerId() {
  return useContext(LayerIdContext);
}
