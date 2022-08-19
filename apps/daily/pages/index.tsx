import type { NextPage } from 'next';
import Head from 'next/head';
import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import Link, { LinkProps } from 'next/link';
import { FC } from 'react';
import styled from '@emotion/styled';
import { TextLink } from '~/frontend/components/link';
import { borderMode } from '~/frontend';

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
        flexDirection="column"
      >
        <Box width="100%" height="3rem">
          <TextLink href="/fieldset">fieldset</TextLink>
        </Box>

        <Box
          width="100%"
          height=".5rem"
          sx={{
            backgroundColor: borderMode,
          }}
        ></Box>
      </Box>
    </>
  );
};

export default Home;
