import { type Mesh } from 'three';
import { type EventHandlers } from '@react-three/fiber/dist/declarations/src/core/events.js';
import { useFrame, ThreeElements, ThreeEvent } from '@react-three/fiber';
import { useObserved } from './use-observed';
import { useRef, useState, FC, useEffect } from 'react';

export type BoxProps = ThreeElements['mesh'];
let shouldLog = true;
export const Box: FC<BoxProps> = props => {
  // This reference will give us direct access to the mesh
  const mesh = useRef<Mesh>(null!);
  // Set up state for the hovered and active state
  const {
    state: { hovered, wheel },
    handlers,
  } = useObserved([useWheel, useHovered] as const);
  const input = useRef({ acceleration: 0 });
  useEffect(() => {
    const mod = input.current;
    mod.acceleration += wheel;
    mod.acceleration +=
      wheel * (Math.sign(mod.acceleration) === Math.sign(wheel) ? 1 : 4);
  }, [wheel.toPrecision(1)]);

  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    const mod = input.current;
    if (mod.acceleration) {
      mod.acceleration =
        Math.sign(mod.acceleration) *
        Math.max(0, Math.abs(mod.acceleration) - 0.005);
    } else mod.acceleration = 0;

    return (mesh.current.rotation.x += mod.acceleration / 100);
  });

  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={event => setActive(!active)}
      {...handlers}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
};

type AnyFunc = (...args: any[]) => any;

function useWheel() {
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

function useHovered(observed?: Record<string, boolean>) {
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
