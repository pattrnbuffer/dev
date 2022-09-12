import {
  EffectCallback,
  DependencyList,
  useEffect,
  useState,
  useRef,
} from 'react';
import { RenderFlags, useRenderFlags } from './use-render-flags';

type EffectMap = Record<
  string,
  ActionEffectCallback | [ActionEffectCallback, DependencyList]
>;
type DispatchMap<T> = Record<keyof T, () => void>;

type ActionEffectCallback = (
  params: ActionEffectParams,
) => ReturnType<EffectCallback>;
type ActionEffectParams = RenderFlags & { called: boolean };

/**
 * Inspired by the following example where we needlessly track flags
 *
 * @example
 *  // create flags for each action
 *  const [pulled, setPulled] = useState(false);
 *  const [revert, setRevert] = useState(false);
 *
 *  // reset actions and run effects
 *  useEffect(() => {
 *    if (pulled) {
 *      setPulled(false);
 *      // have some effect
 *    }
 *    if (revert) {
 *      setRevert(false);
 *      // have some effect
 *    }
 *  }, [pulled, revert]);
 *
 */
export function useEffectActions<T extends EffectMap>(actions: T) {
  const flags = useRenderFlags();
  const dispatchers = useRef<DispatchMap<T>>({} as DispatchMap<T>);

  for (const [key, variadic] of Object.entries(actions)) {
    const [called, setCalled] = useState(false);

    const [effect, deps] =
      typeof variadic === 'function' ? [variadic, []] : variadic;

    useEffect(() => {
      setCalled(false);
      return effect(flags.clone({ called }));
    }, [called, ...deps]);

    dispatchers.current[key as keyof T] ??= () => setCalled(true);
  }

  return dispatchers.current;
}
