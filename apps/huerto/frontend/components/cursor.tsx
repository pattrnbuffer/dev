import React from 'react';
import { Box } from '@chakra-ui/react';

import { Layer, RGBA } from '~/frontend';

export type CursorPosition = Record<`client${'X' | 'Y'}`, number>;

export const Cursor: React.FC<{
  position: CursorPosition;
  rgba: RGBA;
  onClick?: React.MouseEventHandler;
}> = ({ position, rgba, onClick }) => {
  return (
    <Box
      cursor="none"
      userSelect="none"
      position="fixed"
      zIndex={Layer.Cursor}
      minWidth="1rem"
      minHeight="2rem"
      backgroundColor="#000"
      borderRadius=".25rem"
      color="#000"
      transform="translate(-50%, -50%)"
      whiteSpace="nowrap"
      border=".0675rem solid #FFFA"
      boxShadow={`0 0 .5rem -.125rem rgba(${rgba}),  0 0 0 .5px #DDDA, 0 .0625rem .25rem -0.125rem #000B`}
      transition="transform ease-out 45ms"
      style={{
        transform: `translate(${position.clientX}px, ${position.clientY}px) translate(-50%, -50%)`,
        left: 0,
        top: 0,
        backgroundColor: `rgba(${rgba})`,
      }}
      onClick={onClick}
    ></Box>
  );
};
