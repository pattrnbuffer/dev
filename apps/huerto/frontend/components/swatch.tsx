import React from 'react';
import { Box, BoxProps } from '@chakra-ui/react';

import { Layer, RGBA } from '~/frontend';

export const Swatch: React.FC<BoxProps & { rgba: RGBA }> = ({
  rgba,
  ...props
}) => {
  const [r, g, b] = rgba;
  return (
    <Box
      userSelect="none"
      position="relative"
      zIndex={Layer.Tool}
      minWidth="1.75rem"
      minHeight="1.75rem"
      borderRadius="100%"
      color="#000"
      whiteSpace="nowrap"
      transform="scale(1.25)"
      transition="background ease 1s"
      {...props}
      style={{
        boxShadow: String([
          `0 0 0 0.15625rem #FFFE inset`,
          `0 .25rem .325rem -.25rem #0002`,
          `0 .03125rem .0625rem #0002`,
        ]),
        backgroundColor: `rgba(${rgba})`,
      }}
    ></Box>
  );
};
