import { Box, Text } from '@chakra-ui/react';
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  VFC,
  DependencyList,
} from 'react';

import {
  useEvent,
  useHighFrequencyCapacitor,
  useMountedEffect,
} from '@dev/hooks';
import { number as nm } from '@dev/tools';

import { ColorConverter } from '~/common/npm-cie-rgb-color-converter';
import { AllLightsResult } from '~/frontend';
import {
  LightState,
  UseLightStateProps,
} from '~/frontend/providers/api/use-light-state';

let CEILING = 2 * 10 ** 5;

export const LightBox: VFC<
  AllLightsResult[number] & {
    state: LightState;
    onChange: (command: UseLightStateProps[number]) => unknown;
  }
> = ({ light: { id, name }, bridge, state, onChange }) => {
  const [position, setPosition] = useState([state.hue, state.bri]);
  const [history, push, remove] = useHighFrequencyCapacitor(
    v => v?.join(','),
    [0, 0],
    100,
  );

  const update = useMemo(() => reduce(history), [history]);

  const onUpdate = useEvent((delta: number[]) =>
    setPosition(evolve(position, delta)),
  );

  useBounceResult(
    () => {
      if (!update.some(Boolean)) return;
      onUpdate(update);
      remove(() => true);
      return update;
    },
    29,
    91,
    [update],
  );

  const [debugTrigger, setDebugTrigger] = useState();
  useBounceResult(
    useEvent(() => {
      const [hue, bri] = position;
      if (hue !== state.hue && bri !== state.bri) {
        onChange({
          targets: [id],
          command: { hue: (hue / 100) * 5000, bri },
        });
      }

      // setDebugTrigger()
      return position;
    }),
    400,
    900,
    [position],
  );
  // useEffect(() => {
  //   if (!update.some(Boolean)) return;

  //   return createTimeout(() => {
  //     onUpdate(update);
  //     remove(() => true);
  //   }, 50);
  // }, [update]);

  return (
    <Box
      ref={useActiveListener('wheel', (event: WheelEvent) => {
        push([event.deltaX, event.deltaY]);
        event.preventDefault();
      })}
      flex="1 1 auto"
      key={id}
      onClick={() => {
        onChange({
          targets: [id].filter(v => v != null),
          command: { on: !state.on },
        });
      }}
    >
      <Box
        display="flex"
        flexFlow="column nowrap"
        justifyContent="flex-end"
        gridRowGap=".25rem"
        boxShadow={
          '0 0 0 0.125rem ' +
          rgbForLightState({
            ...state,
            alpha: position[1] / 100,
          })
        }
        minWidth="16rem"
        minHeight="8rem"
        p="1rem"
        borderRadius=".625rem"
      >
        <Text fontSize="0.75rem" fontWeight="500">
          {bridge.name}
        </Text>
        <Box flex={1} />

        <Box display="flex">
          <Box>
            <Text
              fontSize="0.75rem"
              fontWeight="900"
              color={state.on ? 'pink' : 'gray'}
            >
              {state.on ? 'ON' : 'OFF'}
            </Text>
            <Text>{name}</Text>
          </Box>
          <Box flex={1} />
          <Box display="flex" flexDirection="column" fontFamily="monospace">
            <Text fontSize="0.75rem" fontWeight="600">
              <Text
                as="span"
                fontWeight="900"
                color={state.on ? 'pink' : 'gray'}
              >
                BRI
              </Text>{' '}
              {state.bri}
            </Text>
            <Text fontSize="0.75rem" fontWeight="600" fontFamily="monospace">
              <Text
                as="span"
                fontWeight="900"
                color={state.on ? 'pink' : 'gray'}
              >
                HUE
              </Text>{' '}
              {state.hue}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

function rgbForLightState(state: {
  on: boolean;
  xy: [number, number];
  bri: number;
  alpha?: number;
}) {
  const { r, g, b } = ColorConverter.xyBriToRgb(...state.xy, state.bri);
  const alpha = state.alpha || 1;
  return `rgba(${r}, ${g}, ${b}, ${state.on ? alpha * 1 : alpha / 2})`;
}

function useActiveListener<
  E extends HTMLElement = HTMLDivElement,
  K extends keyof HTMLElementEventMap = any,
>(type: K, onEvent: (this: E, ev: HTMLElementEventMap[K]) => any) {
  const ref = useRef<E>(null);

  useEffect(() => {
    if (ref.current) {
      return createEventListener(ref.current, type, onEvent, {
        passive: false,
      });
    }
  }, []);

  return ref;
}

function createEventListener<
  E extends HTMLElement,
  K extends keyof HTMLElementEventMap = any,
>(
  element: E,
  type: K,
  listener: (ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  element.addEventListener(type, listener, options);
  return () => element.removeEventListener(type, listener);
}

function createTimeout(fn: () => unknown, duration: number) {
  const id = setTimeout(fn, duration);
  return () => void clearTimeout(id);
}

function useBounceResult<T = unknown>(
  onTimeout: (tripped: boolean, previous?: T) => T,
  duration: number,
  threshold?: number | null,
  deps?: DependencyList,
) {
  const [result, setResult] = useState<T>();
  const startedAt = useMemo(() => Date.now(), [result]);

  useMountedEffect(
    mounted => {
      const delta = Date.now() - startedAt;
      const tripped = nm.typeOf(threshold) && delta > threshold;
      const done = () => setResult(previous => onTimeout(tripped, previous));

      return tripped ? done() : createTimeout(mounted.guard(done), duration);
    },

    [duration, ...(deps ?? [])],
  );

  return result;
}

function reduce(history: number[][]) {
  const sum = history.reduce((a, b) => nm.add(a, b), [0, 0]);
  const velocity = nm.multiply(sum, history.length);
  // // some quick magic on the ceiling
  // CEILING = nm.operate(
  //   (a, b) => (a > CEILING ? a : b > CEILING ? b : CEILING),
  //   ...velocity,
  // );
  const ratio = nm.divide(velocity, CEILING);
  const percent = nm.operate(a => Math.trunc(a), nm.multiply(ratio, 100));

  return percent;
}

function evolve(prev: number[], current: number[]) {
  const next = nm.multiply(
    nm.operate(
      (l, r) => Math.max(l, r),
      nm.operate((l, r) => Math.min(l, r), nm.add(prev, delta), 100),
      0,
    ),
    [8000 / 100, 1],
  );

  return next;
}
