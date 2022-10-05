import { Canvas } from '@react-three/fiber';

import { FC, useEffect, useMemo } from 'react';
import { useUpdateAtom } from 'jotai/utils';
import { useAtomRef } from './atom-ref';

import { depthAtom, useGlobal } from './use-global';
import { Windfarm } from './windfarm';
import { random } from 'lodash';

export const Renderer: FC = () => {
  const global = useGlobal();

  return (
    <Canvas>
      <ambientLight intensity={0.1} />
      <directionalLight color="red" position={[0, 0, global.depth]} />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Windfarm />
    </Canvas>
  );
};
