import { Box } from '@chakra-ui/react';

import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Simulator } from '~/frontend/components/simulator';

const SimulatorPage: NextPage = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return !mounted ? null : (
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
        <Simulator board={{ size: [9, 9] }} interval={300} />
      </Box>
    </>
  );
};

export default SimulatorPage;
