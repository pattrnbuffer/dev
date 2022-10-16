import is from '@sindresorhus/is';
import {
  ConsumerProps,
  createContext,
  FC,
  ProviderProps,
  Reducer,
  useContext,
  useReducer,
} from 'react';

// something exists that returns its value or a promise returning a recompute function
type Stator<S, A> = (state: S, action: A) => S | (() => Promise<Computer<S>>);
type Computer<S> = (state: S) => S;
/**
 *
 *
 *
 * @param reducer: return state or a Promise returning a computer
 * @param defaultState: you know, default state 🤷‍♂️
 * @returns a bomb as bitch used to construct tree based continuations
 *
 * useStatorChannel('gowanus', R) => you're now subscribed to Gowanus Radio
 * useHeadwind('gowanus', R) ⤴
 *
 * useYStator(R) => you've got your self a bidirectional emitter and receiver
 * useTornado ⤴
 * useYawStator(R) ⤴
 *
 * useXStator(R) => you've got your self a longitudinal emitter and receiver
 * useCrosswind(R) ⤴
 * useRollStator(R) ⤴
 *
 * useUpStator(R) =>
 *   you've got yourself a way to hear from your children
 *   build an event aggregator, a tracker that emits at the root,
 *   follow the state of your pending command
 *   while never causing a re-render
 * useUpwind(R) ⤴

 * useDownStator(R) =>
 *  you've got a channel to speak to your children
 *  you've got yourself an asynchronous selector
 * useDownwind(R) ⤴
 *
 */
export const create = <S, A = { type: 'set'; value: S }>(
  reducer: Reducer<S, A> = DefaultReducer as Reducer<S, A>,
  defaultState?: S,
) => {
  const Stator = createContext(reducer);

  const Provider: FC<ProviderProps<S>> = props => (
    <Stator.Provider value={useProvider(props)} />
  );

  const useProvider = (props: ProviderProps<S>) => {
    const value = useContext(Stator);
    const [state, dispatch] = useReducer<S, A>(reducer, defaultState);
  };

  function useConsumer() {
    const value = useContext(Stator);

    return value;
  }

  return {
    use: useConsumer,
    context: Stator,
    Provider: Provider,
    Consumer: Stator.Consumer,
  };
};

const DefaultReducer = <S,>(
  state: S,
  action: { type: 'set'; value: S } | { type: 'reduce'; value: (s: S) => S },
) => (is.function_(action.value) ? action.value(state) : action.value);
