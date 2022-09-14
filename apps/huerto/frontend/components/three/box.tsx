import { ThreeElements } from '@react-three/fiber';
import { FC, useEffect } from 'react';
import { Mesh, useMesh, useMeshObserver } from './mesh';
import { useRotation } from './reactions';

export type BoxProps = ThreeElements['mesh'];

export const Box: FC<BoxProps> = props => {
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <Mesh {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <Scale />
      <Rotation />
      <ReactiveMaterial />
    </Mesh>
  );
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
