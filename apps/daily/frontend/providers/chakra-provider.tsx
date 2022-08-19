import React from 'react';
import {
  extendTheme,
  theme as chakra,
  ChakraProvider as Chakra,
  withDefaultColorScheme,
} from '@chakra-ui/react';
import { FC } from 'react';

import { mode, Styles, StyleFunctionProps } from '@chakra-ui/theme-tools';

const styles: Styles = {};

export default styles;

export const ChakraProvider: FC = ({ children }) => {
  return <Chakra theme={theme}>{children}</Chakra>;
};

export const backgroundMode = mode('pink.100', 'gray.800');
export const colorMode = mode('gray.600', 'pink.100');
export const borderMode = mode('rgba(0, 0, 0, 0.14)', 'rgba(0, 0, 0, 75)');

export const theme = extendTheme(
  {
    fonts: {
      heading: `Poppins, ${chakra.fonts.heading}`,
      body: `Poppins, ${chakra.fonts.body}`,
    },
    config: { useSystemColorMode: true },

    styles: {
      global: (props: StyleFunctionProps) => ({
        body: {
          fontFamily: 'body',
          bg: backgroundMode(props),
          color: colorMode(props),
          transitionProperty: 'background-color',
          transitionDuration: 'normal',
          lineHeight: 'base',
        },
        '*::placeholder': {
          color: mode('gray.400', 'whiteAlpha.400')(props),
        },
        '*, *::before, &::after': {
          borderColor: mode('gray.200', 'whiteAlpha.300')(props),
          wordWrap: 'break-word',
        },
      }),
    },

    components: {
      // Text: {
      //   baseStyle={{

      //   }}
      // },
      Accordian: {
        baseStyle: {
          container: {
            borderTopWidth: '0px',
            borderColor: 'inherit',
            _last: {
              borderBottomWidth: '0px',
            },
          },
        },
        defaultProps: {
          tabIndex: 0,
        },
      },

      Button: {
        baseStyle: {
          outerWidth: '100%',
          innerWidth: '100%',
          maxWidth: '20rem',
        },
      },
    },
  },
  withDefaultColorScheme({ colorScheme: 'messenger' }),
  chakra,
);
