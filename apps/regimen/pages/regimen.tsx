import type {
  NextPage,
  GetServerSideProps,
  InferGetServerSidePropsType,
} from 'next';
import Head from 'next/head';
import useSWR from 'swr';
import { Box, BoxProps, Heading, Text } from '@chakra-ui/react';
import { Database } from '~/common';
import { resolveOrdinaryDatabase } from './api/ordinary.db';

export { Regimen as default, getServerSideProps };

type RegimenProps = InferGetServerSidePropsType<typeof getServerSideProps>;

const Regimen: NextPage<RegimenProps> = ({ database, pages }) => {
  return (
    <>
      <Head>
        <title>regimen</title>
      </Head>
      <Row>
        <Heading>{database.title[0].text.content}</Heading>
      </Row>
    </>
  );
};

const getServerSideProps: GetServerSideProps = async context => {
  return {
    props: await resolveOrdinaryDatabase(),
  };
};

const Row: React.FC<BoxProps> = props => (
  <Box minWidth="100%" maxWidth="" {...props} />
);
