import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
} from 'react';
import { Box } from '@chakra-ui/react';
import { ColorConverter } from '~/common';
import { useImageData, useMousePosition, ColorSpaceGrid } from '~/frontend';
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
  if (typeof window === 'undefined') {
    return null;
  }
  const [selection, setSelection] = useState<[number, number]>();

  const position = useMousePosition();
  const [x, y] = xyFromDocumentPosition(position);

  useEffect(() => {
    if (selection == null) return;
    const [x, y] = selection;

    fetch(`/api/hue/all-lights-color/${x}/${y}`);
  }, [selection]);

  const [rgba, convert] = useImageData(
    document.getElementById('CIEImage') as HTMLImageElement | undefined,
    [x, y],
  );

  return (
    <Box display="flex" alignItems="center" justifyContent="center" flex="auto">
      <Image id="CIEImage" src={imageUrl} layout="fill" />
      <ColorSpaceGrid
        count={50}
        convert={useCallback(xy => `rgb(${convert(xy).join(',')})`, [convert])}
      />
      <Box
        position="fixed"
        zIndex={2}
        minWidth="1rem"
        minHeight="2rem"
        backgroundColor="#000"
        borderRadius=".25rem"
        color="#000"
        transform="translate(-50%, -50%)"
        whiteSpace="nowrap"
        cursor="none"
        style={{
          left: `${position.clientX}px`,
          top: `${position.clientY}px`,
          backgroundColor: `rgb(${rgba.join(',')})`,
        }}
        onClick={event => setSelection(xyFromDocumentPosition(event))}
      ></Box>
    </Box>
  );
};

export default Home;

const xyFromDocumentPosition = (
  position: Record<`client${'X' | 'Y'}`, number>,
): [number, number] => {
  if (typeof document === 'undefined') return [0, 0];

  const x = 0.8 * (position.clientX / document.body.clientWidth);
  const y =
    0.9 *
    ((document.body.clientHeight - position.clientY) /
      document.body.clientHeight);

  return [x, y];
};

const xyRGB = ([x, y]: [number, number]) => {
  const color = ColorConverter.xyBriToRgb(
    x * 0.79 + 0.025,
    y * 0.81 + 0.055,
    255,
  );

  return [color.r, color.g, color.b];
};
