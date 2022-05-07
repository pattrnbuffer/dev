import { Box, Text } from '@chakra-ui/react';
import React, { useEffect, useMemo, useRef, useState, VFC } from 'react';

import { useEvent, useHighFrequencyCapacitor } from '@dev/hooks';
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
  const [position, setPosition] = useState([100, 100]);
  const [history, push, remove] = useHighFrequencyCapacitor(
    v => v?.join(','),
    [0, 0],
    100,
  );

  const update = useMemo(() => {
    const sum = history.reduce((a, b) => nm.add(a, b), [0, 0]);
    const velocity = nm.multiply(sum, history.length);
    // some quick magic on the ceiling
    CEILING = nm.operate(
      (a, b) => (a > CEILING ? a : b > CEILING ? b : CEILING),
      ...velocity,
    );
    const ratio = nm.divide(velocity, CEILING);
    const percent = nm.operate(a => Math.trunc(a), nm.multiply(ratio, 100));
    return percent;
  }, [history]);

  const onUpdate = useEvent((delta: number[]) => {
    const prev = position;

    // const xrange = 100 - prev[0]
    // const yrange = 100 - prev[1]
    const next = nm.operate(
      (l, r) => Math.max(l, r),
      nm.operate((l, r) => Math.min(l, r), nm.add(prev, delta), 100),
      0,
    );

    setPosition(next);
  });
  useEffect(() => {
    if (!update.some(Boolean)) return;

    return createTimeout(() => {
      onUpdate(update);
      remove(() => true);
    }, 5);
  }, [update]);

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
        <Text
          fontSize="0.75rem"
          fontWeight="900"
          color={state.on ? 'pink' : 'gray'}
        >
          {state.on ? 'ON' : 'OFF'}
        </Text>

        <Text>{name}</Text>
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

function createEventListener<K extends keyof HTMLElementEventMap>(
  element: HTMLElement,
  type: K,
  listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  element.addEventListener(type, listener, options);
  return () => element.removeEventListener(type, listener);
}

function createTimeout(fn: () => unknown, duration: number) {
  const id = setTimeout(fn, duration);
  return () => void clearTimeout(id);
}
