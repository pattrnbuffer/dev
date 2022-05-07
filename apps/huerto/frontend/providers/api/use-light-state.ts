import { useAsyncEffect, useCapacitor, useEvent } from '@dev/hooks';
import { number, ResultType } from '@dev/tools';
import { fetch } from '@evanrs/fetch';
import type {
  LightState,
  LightStateCommand,
  LightStateRequest,
  LightStateResponse,
} from '~/pages/api/hue/light-state';

export type UseLightStateProps = LightStateRequest;
export type UseLightStateValue = ReturnType<typeof useLightState>;
export type UseLightStateResponse = UseLightStateValue[0];
export { LightState };

type Lifecycle = ResultType<
  { request: LightStateRequest },
  { response: Response; data: LightStateResponse },
  { response: Response; error?: unknown }
>;

export function useLightState(state?: LightStateRequest) {
  const [history, push, clean] = useCapacitor<Lifecycle>(
    v => v?.request,
    { type: 'accepted', request: state },
    30,
  );

  const request = history.find((v, i, { [i + 1]: next }) =>
    next?.type === 'accepted' ? false : true,
  )?.request;

  useAsyncEffect(
    async ({ commit }) => {
      if (request == null) return;

      push({ type: 'pending', request });

      const response = await fetch<LightStateResponse>(`/api/hue/light-state`, {
        method: 'POST',
        body: JSON.stringify(request),
      });

      // TODO: use response.headers['content-type'] to avoid catch
      const [error, data] = await response
        .json()
        .then(data => [undefined, data] as const)
        .catch(error => [error, undefined] as const);

      commit(() =>
        push({
          request: request,
          response,
          ...(data == null
            ? ({ type: 'rejected', error } as const)
            : ({ type: 'resolved', data } as const)),
        }),
      );
    },
    [request],
  );

  return [
    history,
    useEvent((request: LightStateRequest) =>
      push({ type: 'accepted', request }),
    ),
    clean,
  ] as const;
}

export function toLightStateFromCommand(
  source: LightState,
  command: LightStateCommand,
) {
  const state = { ...source };
  const map: Record<
    keyof LightStateCommand | 'xy' | 'xy_inc',
    keyof LightState | `+` | undefined
  > = {
    on: 'on',

    effect: 'effect',
    alert: 'alert',

    brightness: 'bri',
    bri: 'bri',
    bri_inc: '+',
    hue: 'hue',
    hue_inc: '+',
    saturation: 'sat',
    sat: 'sat',
    sat_inc: '+',
    ct: 'ct',
    ct_inc: '+',

    xy: 'xy',
    xy_inc: '+',

    transition: undefined,
  };

  for (const prop of Object.keys(command) as (keyof LightStateCommand)[]) {
    let key = map[prop];
    if (key == null) return;

    const name = (key === '+' ? prop.split('_')[0] : key) as keyof LightState;
    const value = state[name];
    const change = command[prop];

    Object.assign(state, {
      [name]: key === '+' ? number.add(value, change) : change,
    });
  }

  return state;
}

// function useOperation<T, R>(onRequest: (request: T) => Promise<R>) {
//   onRequest = useEvent(onRequest);

//   const mounted = useMountedRef();
//   const [state, dispatch] = useReducer((state, action) => {
//     return [];
//   }, []);

//   const [operation, setOperation] = useState<
//     { status: 'pending'; request: T } | { status: 'resolved'; request: T }
//   >();

//   useEffect(() => {
//     onRequest(request).then(mounted.callback(op => setOperation()));
//   }, [request]);

//   return;
// }

// function useRequests<T>(operator: () => Promise<T>) {
//   useEffect(() => {
//     operator;
//   }, []);
// }

// function useLatestValue<T>(value: T, filter = (v: T) => v != null) {
//   const [latestValue, setLatestValue] = useState(value);

//   useEffect(() => {
//     if (filter(value)) setLatestValue(value);
//   }, [value]);

//   return filter(value) ? latestValue : value;
// }
