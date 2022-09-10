import { Box } from '@chakra-ui/react';

import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Simulator } from '~/frontend/components/simulator';
import { Renderer } from '~/frontend/components/three';

const ThreePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>🫠</title>
      </Head>
      <Box width="100vw" height="100vh">
        <Renderer></Renderer>
      </Box>
    </>
  );
};

export default ThreePage;
