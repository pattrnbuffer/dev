import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';

export { ProductLog as default };

function ProductLog({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  //
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
