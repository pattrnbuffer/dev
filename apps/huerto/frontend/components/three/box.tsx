import { ThreeElements, useFrame } from '@react-three/fiber';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useHovered, useWheel } from './handlers';
import { useCommits } from './use-commits';
import { useObserved } from './use-observed';
import { useTrunk } from './use-trunk';
import { Mesh } from './mesh';
import type * as Three from 'three';

export type BoxProps = ThreeElements['mesh'];

export const Box: FC<BoxProps> = props => {
  // This reference will give us direct access to the mesh
  const mesh = useRef<Three.Mesh>(null!);
  // Set up state for the hovered and active state
  const {
    state: { hovered, wheel },
    handlers,
  } = useObserved([useWheel, useHovered] as const);

  const io = useRef({
    delta: { x: 0, y: 0, z: 0, t: 0 },
  });

  useEffect(() => {
    const { delta } = io.current;
    const same = Math.sign(delta.y) === Math.sign(wheel);
    delta.y += wheel;
    delta.y += wheel * (same ? 1 : 4);
  }, [wheel.toPrecision(1)]);

  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    const ioc = io.current;

    if (ioc.delta.y) {
      ioc.delta.y =
        Math.sign(ioc.delta.y) * Math.max(0, Math.abs(ioc.delta.y) - 0.005);
    } else {
      ioc.delta.y = 0;
    }

    return (mesh.current.rotation.x += ioc.delta.y / 100);
  });

  // Return view, these are regular three.js elements expressed in JSX
  return (
    <Mesh
      {...props}
      ref={mesh}
      scale={active ? 1.5 : 1}
      onClick={event => setActive(!active)}
      {...handlers}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </Mesh>
  );
};
