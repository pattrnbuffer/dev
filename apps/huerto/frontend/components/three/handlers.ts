import { ThreeEvent } from '@react-three/fiber';
import { useState } from 'react';
import { useObserved } from './use-observed';

export type DefaultObservers = ReturnType<typeof useDefaultObservers>;
export type DefaultObserversState = DefaultObservers['state'];
export function useDefaultObservers() {
  return useObserved([useClicked, useWheel, useHovered] as const);
}

export function useClicked() {
  const [state, setState] = useState(false);

  return {
    key: 'clicked',
    state,
    handlers: {
      onClick: () => setState(v => !v),
    },
  } as const;
}

export function useWheel() {
  const [state, setState] = useState(0);

  return {
    key: 'wheel',
    state,
    handlers: {
      onWheel: (event: ThreeEvent<WheelEvent>) => {
        const value = event.nativeEvent.deltaY / event.nativeEvent.clientX;
        setState(-Number(value.toPrecision(2)));
      },
    },
  } as const;
}

export function useHovered(observed?: Record<string, boolean>) {
  const [hovered, setHover] = useState(false);

  return {
    key: 'hovered',
    state: hovered,
    handlers: {
      onPointerOver: () => setHover(true),
      onPointerOut: () => setHover(false),
    },
  } as const;
}

export function useWheelHandles(onUpdate: (hovered: number) => void) {
  return {
    onWheel(event: ThreeEvent<WheelEvent>) {
      onUpdate(event.nativeEvent.deltaY / event.nativeEvent.clientX);
    },
  };
}
export function useHoverHandles(onUpdate: (hovered: boolean) => void) {
  return {
    onPointerOver: () => onUpdate(true),
    onPointerOut: () => onUpdate(false),
  };
}

const handles = {
  click: (onUpdate: () => void) => ({
    onClick: () => onUpdate(),
  }),

  wheel: (onUpdate: (hovered: number) => void) => ({
    onWheel: (event: ThreeEvent<WheelEvent>) =>
      onUpdate(event.nativeEvent.deltaY / event.nativeEvent.clientX),
  }),

  hover: (onUpdate: (hovered: boolean) => void) => ({
    onPointerOver: () => onUpdate(true),
    onPointerOut: () => onUpdate(false),
  }),
};
