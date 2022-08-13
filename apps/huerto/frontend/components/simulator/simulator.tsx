import { Box } from '@chakra-ui/react';
import { FC } from 'react';
import { useWorld, useWorldSize } from './hooks';
import { WorldBlock } from './types';

export const Simulator: FC = () => {
  const world = useWorld();
  console.log(world);
  return (
    <>
      {Object.entries(world.blocks).map(([address, block]) => (
        <Block key={block.address} {...block} />
      ))}
    </>
  );
};

const Block: FC<WorldBlock> = ({ address, color }) => {
  const [x, y] = useWorldSize();
  return (
    <Box
      minWidth={`${100 / x}vw`}
      minHeight={`${100 / y}vh`}
      flex={`1 1 0`}
      backgroundColor={color}
    />
  );
};
