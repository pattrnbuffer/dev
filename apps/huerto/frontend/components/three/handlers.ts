import { ThreeEvent } from '@react-three/fiber';
import { useState } from 'react';

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
