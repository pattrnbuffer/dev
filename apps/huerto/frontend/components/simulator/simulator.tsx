import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import { useMousePosition } from '~/frontend/hooks';
import { rgba } from './color';
import { Locator } from './types';
import { useNeighbors } from './useNeighbors';
import { vectorFor } from './vector';
import {
  useBlockState,
  useWorld,
  useWorldSize,
  useWorldTick,
  WorldProvider,
  WorldProviderProps,
} from './world';

export const Simulator: FC<WorldProviderProps> = props => {
  return (
    <WorldProvider {...props} board={{ size: [12, 12] }}>
      <World />
    </WorldProvider>
  );
};

export const World: FC = () => {
  const world = useWorld();
  const { wx, wy } = useMousePosition();

  return (
    <>
      {Object.keys(world.blocks).map(address => (
        <Block
          key={address}
          // fx={wx}
          // fy={wy}
          fx={0.5}
          fy={0.5}
          locator={address}
        />
      ))}
    </>
  );
};

const Block: FC<{ fx: number; fy: number; locator: Locator }> = ({
  fx,
  fy,
  locator,
}) => {
  const [width, height, ...rest] = useWorldSize();
  const [block, setState] = useBlockState(locator);
  const { locals } = useNeighbors(block);

  const affinities = vectorFor(
    [width, height, ...rest],
    block.point,
    // why did this need to be revered?
    [fy, fx],
  );
  const [ax, ay] = affinities;

  const alpha = Math.max(
    0.6,
    1 - (Math.abs(ax / width) + Math.abs(ay / height)),
  );

  return (
    <Box
      color="rgba(255, 255, 255, 0.75)"
      display="flex"
      gap="1rem"
      justifyContent="center"
      alignItems="center"
      minWidth={`${100 / width}vw`}
      minHeight={`${100 / height}vh`}
      flex={`1 1 0`}
      backgroundColor={rgba(block.color)}
      style={{ opacity: alpha }}
      transition="opacity 0.3s ease"
    >
      {affinities.map((v, i) => (
        <Box key={i} fontSize=".5rem">
          {Math.round(100 * v) / 100}
        </Box>
      ))}
    </Box>
  );
};
