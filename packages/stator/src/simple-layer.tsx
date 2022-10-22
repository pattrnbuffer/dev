import React, {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

const SimpleLayerContext = createContext<number>(0);

type SLFC<T, U = T> = FC<{
  transform: (update: T, reduced: U | undefined) => U;
  children: ReactNode;
}>;

export const Provider: SLFC<number> = ({ children, transform }) => {
  const context = useContext(SimpleLayerContext);
  const [value, setValue] = useState<number>(() =>
    transform(context, undefined),
  );
  useEffect(() => setValue(state => transform(context, state)), [context]);

  return (
    <SimpleLayerContext.Provider value={value}>
      {children}
    </SimpleLayerContext.Provider>
  );
};

export function useSimpleLayer() {
  return useContext(SimpleLayerContext);
}
