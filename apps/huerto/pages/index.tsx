import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Box } from '@chakra-ui/react';
import {
  Layer,
  useImageData,
  useMousePosition,
  ColorSpaceGrid,
  useAllLightsColorSelection,
  Cursor,
  CursorPosition,
} from '~/frontend';
import imageUrl from '~/frontend/assets/CIExy1931-pristine-crop.png';

export { Home as default };
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

/**
 * https://company235.com/tools/colour/cie.html
 */
const CIE1933: React.FC = props => {
  if (typeof window === 'undefined') {
    return null;
  }

  const imageId = 'CIE1933:image';
  const [selection, setSelection] = useState<[number, number]>();
  const [debug, setDebug] = useState({
    canvas: false,
    grid: false,
  });
  const position = useMousePosition();

  const canvasRef = useRef<HTMLCanvasElement>();
  const [rgba, rgbaFor] = useImageData(
    document.getElementById(imageId) as HTMLImageElement | undefined,
    xyFromDocumentPosition(position),
    canvasRef.current,
  );

  useAllLightsColorSelection(selection);

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flex="auto"
        cursor="none"
        userSelect="none"
      >
        <Image id={imageId} src={imageUrl} layout="fill" />

        {debug.canvas && (
          <canvas
            ref={canvas => {
              canvasRef.current = canvas ?? undefined;
            }}
            style={{
              position: 'fixed',
              top: '.5rem',
              left: 0,
              zIndex: Layer.Debug,
              opacity: 0.5,
            }}
          />
        )}

        {debug.grid && (
          <ColorSpaceGrid
            convert={useCallback(xy => `rgba(${rgbaFor(xy)})`, [rgbaFor])}
          />
        )}
      </Box>

      <Cursor
        position={position}
        rgba={rgba}
        onClick={event => setSelection(xyFromDocumentPosition(event))}
      />
    </>
  );
};

const xyFromDocumentPosition = (
  position: CursorPosition,
  dxy?: number | [number, number],
): [number, number] => {
  const [dx = 1, dy = 1] = Array.isArray(dxy) ? dxy : [dxy, dxy];

  const x = position.clientX / document.body.clientWidth;
  const y =
    (document.body.clientHeight - position.clientY) /
    document.body.clientHeight;

  return [x * dx, y * dy];
};
