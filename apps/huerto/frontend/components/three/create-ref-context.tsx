import { createContext, useContext, useRef, FC, ReactNode } from 'react';

export function createRefContext<T>(sharedValue?: T) {
  const RefContext = createContext({ current: sharedValue });

  const RefProvider: FC<{ value: T; children?: ReactNode }> = ({
    value,
    children,
  }) => {
    const ref = useRef(value ?? sharedValue);
    return <RefContext.Provider value={ref}>{children}</RefContext.Provider>;
  };

  return Object.assign(
    function useRefContext() {
      return useContext(RefContext);
    },
    { Provider: RefProvider },
  );
}
