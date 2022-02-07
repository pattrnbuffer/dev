import { Box } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>👻</title>
      </Head>
      <Box width="100vw" height="100vh" display="flex" fontSize="4rem">
        👻
      </Box>
    </>
  );
};

export default Home;
