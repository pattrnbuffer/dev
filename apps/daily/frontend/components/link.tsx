import { Box, Text } from '@chakra-ui/react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import Link, { LinkProps } from 'next/link';
import { FC } from 'react';

export const TextLink: FC<LinkProps> = props => {
  return (
    <Link {...props}>
      <Box
        css={css`
          flex: 1;
          max-width: max-content;
          min-width: 5rem;
          display: flex;
          justify-content: center;
          align-content: center;
          user-select: none;
          font-weight: 500;
          cursor: pointer;
        `}
      >
        hai
      </Box>
    </Link>
  );
};
