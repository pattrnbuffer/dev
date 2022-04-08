import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { Box } from '@chakra-ui/react';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>👻</title>
      </Head>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        Daily
      </Box>
    </>
  );
};

export default Home;
