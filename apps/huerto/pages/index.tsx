import { Box } from '@chakra-ui/react';
import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import imageUrl from '~/frontend/assets/PlanckianLocusCropped.png';

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
        <CIE1933 />
      </Box>
    </>
  );
};

const CIE1933: React.FC = props => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" flex="auto">
      <Image
        src={imageUrl}
        layout="fill"
        onClick={event => {
          const position = [
            'clientX',
            'clientY',
            'pageX',
            'pageY',
            'screenX',
            'screenY',
            // 'movementX',
            // 'movementY',
          ].reduce((acc, k) => ({ ...acc, [k]: event[k] }), {});

          const x = event.clientX / document.body.clientWidth;
          const y =
            (document.body.clientHeight - event.clientY) /
            document.body.clientHeight;

          console.log('x:', x, 'y:', y);

          fetch(`/api/hue/all-lights-color/${x}/${y}`);
        }}
      />
    </Box>
  );
};

export default Home;
