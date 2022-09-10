import { Canvas } from '@react-three/fiber';

import { FC } from 'react';

import { Box } from './box';
import { useGlobal } from './use-global';

// import { } from '@react-three/drei'

export const Renderer: FC = () => {
  const global = useGlobal();

  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <directionalLight color="red" position={[0, 0, global.depth]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
};
