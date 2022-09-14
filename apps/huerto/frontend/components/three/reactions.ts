import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useMesh, useMeshObserver } from './mesh';

export function useRotation() {
  const mesh = useMesh();
  const { wheel } = useMeshObserver();

  const io = useRef({
    delta: { x: 0, y: 0, z: 0, t: 0 },
  });

  useEffect(() => {
    const { delta } = io.current;
    const same = Math.sign(delta.y) === Math.sign(wheel);
    delta.y += wheel;
    delta.y += wheel * (same ? 1 : 4);
  }, [wheel.toPrecision(1)]);

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
}
