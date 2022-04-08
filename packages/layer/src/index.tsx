import {
  createContext,
  useContext,
  useReducer,
  Dispatch,
  DispatchWithoutAction,
  Reducer,
  ReducerWithoutAction,
  ReducerState,
  ReducerAction,
  useCallback,
  useMemo,
} from 'react';

export type LayerContextValue<
  Action,
  Data extends LayerData<unknown> = LayerData<unknown>,
  Domain extends LayerDomain<unknown> = LayerDomain<unknown>,
> = {
  domain: Domain;
  data: Data;
  meta: LayerMeta<{}>;
  dispatch: Dispatch<Action> & {
    (action: Action, context: LayerContextValue<Action, Data, Domain>): void;
  };
};

type LayerDomain<T extends unknown> = T & {
  name: string;
};

type LayerData<T extends unknown> = T & {
  name: string;
};

type LayerMeta<T> = T & {
  id: string;
};

type LayerReducer<
  S,
  A,
  C extends LayerContextValue<A> = LayerContextValue<A>,
> = (state: S, action: A, context: C) => S;

type ReducerReturnValue = {
  id: string;
  name: string;
};

export function createLayerDomain<
  S,
  T,
  C extends LayerContextValue<T> = LayerContextValue<T>,
>() {
  const LayerProvider = (data: LayerData<unknown>) => {
    const layer = useMemo(
      (): C => ({
        data,
        domain,
        meta: {
          name,
        },
      }),
      [input],
    );
    return <LayerContext.Provider value={layer}> </LayerContext.Provider>;
  };

  const useLayerReducer = (
    reducer: LayerReducer<S, T, C>,
  ): [ReducerReturnValue, Dispatch<T>] => {
    const context = useContext(LayerContext);

    const [layer, dispatch] = useReducer(
      (state: S, action: T) => reducer(state, action, context),
      {},
    );

    const dispatcher = useCallback(
      (action: T, layer: S) => {
        try {
          dispatch(action);
        } catch (action) {
          context.dispatch(action, layer);
        }
      },
      [dispatch, context.dispatch],
    );

    return [layer.meta, dispatcher];
  };

  const LayerContext = createContext<LayerContextValue<T>>({
    name: 'root',
    dispatch() {
      throw new Error(
        'No layer context found, please add a LayerContext.Provider',
      );
    },
  });

  return {
    LayerProvider,
    useLayerReducer,
  };
}
