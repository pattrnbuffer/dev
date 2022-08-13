import { Box } from '@chakra-ui/react';

import type { NextPage } from 'next';
import Head from 'next/head';
import { Simulator } from '~/frontend/components/simulator/simulator';

const SimulatorPage: NextPage = () => {
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
        flexFlow="row wrap"
      >
        <Simulator />
      </Box>
    </>
  );
};

export default SimulatorPage;
