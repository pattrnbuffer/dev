import type { NextPage } from 'next';
import Head from 'next/head';
import useSWR from 'swr';
import { Box } from '@chakra-ui/react';

const fetcher = (url: string) => fetch(url).then(r => r.json());

const Home: NextPage = () => {
  const { data } = useSWR('/api/ordinary.db', fetcher);

  console.log({ data });
  return (
    <>
      <Head>
        <title>regimen</title>
      </Head>
      <Box as="pre">{JSON.stringify(data, null, 2)}</Box>
    </>
  );
};

export default Home;
