import { Box, Text } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { FC } from 'react';

export const BoxTile = styled(Box)`
  position: relative;
  display: flex;
  flex: 1 1 0;
  justify-content: center;
  align-items: center;
  transition: opacity 180ms ease-out;
  color: rgba(255, 255, 255, 0.75);
`;

export const TileTest = styled(Text)`
  font-size: 0.5rem;
  font-weight: 900;
`;

export const KittyCat: FC<{ delta: number[] }> = ({ delta: [x, y] }) => {
  return (
    <Box
      position="absolute"
      bottom="1px"
      fontSize="2rem"
      style={
        x >= 0
          ? { left: '.25rem' }
          : { right: '.25rem', transform: 'scaleX(-1)' }
      }
    >
      🐈
    </Box>
  );
};
