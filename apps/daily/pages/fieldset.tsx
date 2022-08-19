import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import Link from 'next/link';

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
        <Heading size="md">fieldset</Heading>
      </Box>
    </>
  );
};

export default Home;
