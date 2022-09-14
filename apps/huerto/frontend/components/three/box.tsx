import { ThreeElements } from '@react-three/fiber';
import { FC, useEffect } from 'react';
import { Mesh, useMesh, useMeshObserver } from './mesh';
import { useRotation } from './reactions';

export type BoxProps = ThreeElements['mesh'] & {
  translate: [number, number, number];
};

export const Box: FC<BoxProps> = ({ translate, ...props }) => {
  return (
    <Mesh {...props}>
      <Position translate={translate} />
      <Scale />
      <Rotation />
      <ReactiveMaterial />

      <boxGeometry args={[1, 1, 1]} />
    </Mesh>
  );
};

const Position: FC<{ translate: number[] }> = ({ translate, ...props }) => {
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

const Scale = () => {
  const mesh = useMesh();
  const { state } = useMeshObserver();
  useEffect(() => {
    const scale = state.clicked ? 1.5 : 1;
    mesh.current.scale.set(scale, scale, scale);
  }, [state.clicked]);
  return null;
};

const Rotation = () => {
  useRotation();
  return null;
};

const ReactiveMaterial = () => {
  const { state } = useMeshObserver();
  return <meshStandardMaterial color={state.hovered ? 'hotpink' : 'orange'} />;
};
