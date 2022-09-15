import { useFrame } from '@react-three/fiber';
import { FC, useEffect, useRef } from 'react';
import { useMesh, useMeshObserver } from './mesh';

export type PositionProps = { translate?: number[] };
export const Position: FC<PositionProps> = ({ translate, ...props }) => {
  const mesh = useMesh();
  const [x, y, z] = Array.from({ ...[0, 0, 0], ...translate, length: 3 });

  useEffect(() => {
    mesh.current?.translateX(x).translateY(y).translateZ(z);
    return () => {
      mesh.current?.translateX(-x).translateY(-y).translateZ(-z);
    };
  }, [mesh, x, y, z]);

  return null;
};

export type RotatorProps = {
  rotator?: [x: number, y: number, z: number, s: number];
};
export const Rotator: FC<RotatorProps> = ({ rotator }) => {
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
