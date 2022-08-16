import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';

const Huerto = ({ Component, pageProps }: AppProps) => {
  return (
    <ChakraProvider>
      {/* @ts-expect-error: this is fine, but also — why? */}
      <Component {...pageProps} />
    </ChakraProvider>
  );
};

export default Huerto;
