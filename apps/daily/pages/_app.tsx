import type { AppProps } from 'next/app';
import { ChakraProvider } from '~/frontend/providers/chakra-provider';
import { GlobalProvider } from '~/frontend/providers/global-provider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <GlobalProvider>
        <Component {...pageProps} />
      </GlobalProvider>
    </ChakraProvider>
  );
}

export default MyApp;
