import { Canvas } from '@react-three/fiber';

import { FC } from 'react';

import { Box } from './box';
import { useGlobal } from './use-global';

// import { } from '@react-three/drei'

export const Renderer: FC = () => {
  const global = useGlobal();
  const unit = 1;
  const length = 4;
  const offset = ((length - 1) / 2) * unit;

  const list = Array.from({ length }).flatMap((_, x) =>
    Array.from({ length }).map((_, y) => {
      return [x, y];
    }),
  );

  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <directionalLight color="red" position={[0, 0, global.depth]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      {list.map(([x, y], i) => (
        <Box
          key={[x, y, i].join()}
          position={[x, y, 0]}
          translate={[-offset, -offset, 0]}
        />
      ))}
    </Canvas>
  );
};
