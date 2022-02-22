import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Box } from '@chakra-ui/react';
import { ColorConverter } from '~/common';
import { useMousePosition } from '~/frontend';
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
  const position = useMousePosition();
  const [selection, setSelection] = useState<[number, number]>();

  useEffect(() => {
    if (selection == null) return;
    const [x, y] = selection;

    fetch(`/api/hue/all-lights-color/${x}/${y}`);
  }, [selection]);

  const [x, y] = xyFromDocumentPosition(position);
  const color = ColorConverter.xyBriToRgb(x, y, 254);

  return (
    <Box display="flex" alignItems="center" justifyContent="center" flex="auto">
      <Image src={imageUrl} layout="fill" />
      <Box
        position="fixed"
        zIndex={2}
        paddingY=".5rem"
        paddingX="1rem"
        minWidth="2rem"
        minHeight="2rem"
        backgroundColor="#000"
        borderRadius="1rem"
        color="#000"
        transform="translate(-50%, -50%)"
        cursor="none"
        whiteSpace="nowrap"
        style={{
          left: `${position.clientX}px`,
          top: `${position.clientY}px`,
          backgroundColor: `rgb(${color.r},${color.g},${color.b})`,
        }}
        onClick={event => setSelection(xyFromDocumentPosition(event))}
      >
        [{Math.round(x * 100) / 100}, {Math.round(y * 100) / 100}]
      </Box>
    </Box>
  );
};

export default Home;

const xyFromDocumentPosition = (
  position: Record<`client${'X' | 'Y'}`, number>,
): [number, number] => {
  if (typeof document === 'undefined') return [0.5, 0.5];

  const x = 0.8 * (position.clientX / document.body.clientWidth);
  const y =
    0.9 *
    ((document.body.clientHeight - position.clientY) /
      document.body.clientHeight);

  return [x, y];
};
