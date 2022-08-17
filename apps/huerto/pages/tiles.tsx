import { Box } from '@chakra-ui/react';

import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Simulator } from '~/frontend/components/simulator';

const TilesPage: NextPage = () => {
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
        backgroundColor="#FFF"
      >
        <Simulator board={{ size: [8, 8] }} interval={300} />
      </Box>
    </>
  );
};

export default TilesPage;
