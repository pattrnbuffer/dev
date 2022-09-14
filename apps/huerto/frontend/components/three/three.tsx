import { Canvas } from '@react-three/fiber';

import { FC } from 'react';

import { Grid } from './grid';
import { useGlobal } from './use-global';

export const Renderer: FC = () => {
  const global = useGlobal();

  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <directionalLight color="red" position={[0, 0, global.depth]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Grid />
    </Canvas>
  );
};
