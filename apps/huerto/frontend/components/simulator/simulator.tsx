import { Box } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { FC, useEffect, useState } from 'react';
import { useMousePosition } from '~/frontend/hooks';
import { colors, rgba } from './color';
import { createWorld } from './create-world';
import {
  useAllBlockAtoms,
  setBlockAtom,
  useBlockAtom,
  BlockAtom,
} from './jotai';
import { forEachPosition } from './jotai/create-blocks';
import { Locator } from './types';
import { useNeighbors } from './useNeighbors';
import { vectorFor } from './vector';
import { useBlockState, useWorldSize, WorldProviderProps } from './world';

export const Simulator: FC<WorldProviderProps> = ({ board, interval }) => {
  const [stage, setStage] = useState<'mounted' | 'created'>('mounted');
  const [, setBlock] = useAtom(setBlockAtom);

  useEffect(() => {
    if (stage === 'mounted') {
      setStage('created');
      forEachPosition(board.size, position => {
        setBlock({
          position,
          props: {
            color: {
              affinity: Math.random(),
              integrity: Math.random(),
              // @ts-expect-error
              value:
                colors[position.reduce((a, b) => a + b, 0) % colors.length],
            },
          },
        });
      });
    }
  }, []);

  return <BlockMap />;
};

export const BlockMap: FC = () => {
  const { wx, wy } = useMousePosition();
  const blockMap = useAllBlockAtoms();

  return (
    <>
      {Object.entries(blockMap).map(([key, atom]) => (
        <Block key={key} atom={block}></Block>
      ))}
    </>
  );
};

const Block: FC<{ atom: BlockAtom }> = ({ atom }) => {
  useBlockAtom(locator);
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
