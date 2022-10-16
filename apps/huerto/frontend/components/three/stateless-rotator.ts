import { useFrame } from '@react-three/fiber';
import { FC, useEffect, useRef } from 'react';
import { createRefContext } from './create-ref-context';
import { useMesh, useMeshObserver } from './mesh';

const useRefContext = createRefContext({
  rotator: {
    x: 0,
    y: 0,
    z: 0,
  },
});

// export const Stator =

export const StatelessRotator: FC = () => {
  const mesh = useMesh();
  const {
    state: { wheel },
  } = useMeshObserver();

  const io = useRef({
    delta: { x: 0, y: 0, z: 0, t: 0 },
  });

  const [x, y, z, speed = 0] = rotator ?? [];
  useEffect(() => {
    const { delta } = io.current;
    const same = Math.sign(delta.y) === Math.sign(speed);
    delta.y += speed;
    delta.y += speed * (same ? 1 : 4);
  }, [x, y, z, speed]);

  useEffect(() => {
    const { delta } = io.current;
    const same = Math.sign(delta.y) === Math.sign(wheel);
    delta.y += wheel;
    delta.y += wheel * (same ? 1 : 4);
  }, [wheel.toPrecision(1)]);

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => {
    if (!mesh) return;

    const ioc = io.current;

    if (ioc.delta.y) {
      ioc.delta.y =
        Math.sign(ioc.delta.y) * Math.max(0, Math.abs(ioc.delta.y) - 0.005);
    } else {
      ioc.delta.y = 0;
    }

    return (mesh.current.rotation.x += ioc.delta.y / 100);
  });

  return null;
};
