import { ThreeElements } from '@react-three/fiber';
import { FC, useEffect } from 'react';
import { Mesh, useMesh, useMeshObserver } from './mesh';
import { Position, PositionProps, Rotator, RotatorProps } from './aspects';

export type BoxProps = ThreeElements['mesh'] & PositionProps & RotatorProps;

export const Box: FC<BoxProps> = ({
  translate,
  rotator,
  children,
  ...props
}) => {
  return (
    <Mesh {...props}>
      <Position translate={translate} />
      <Scale />
      <Rotator rotator={rotator} />
      <ReactiveMaterial />

      <boxGeometry args={[1, 1, 1]} />

      {children}
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

const ReactiveMaterial = () => {
  const { state } = useMeshObserver();
  return <meshStandardMaterial color={state.hovered ? 'hotpink' : 'orange'} />;
};
