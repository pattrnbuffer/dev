import React, { useCallback, useState, useRef } from 'react';
import Image from 'next/image';
import { Box } from '@chakra-ui/react';

import { Layer } from '~/frontend/layer';
import { useImageData, useMousePosition, XY, RGBA } from '~/frontend/hooks';
import { useAllLightsColorSelection } from '~/frontend/providers';

import { Swatch } from './swatch';
import { Cursor, CursorPosition } from './cursor';
import { ColorSpaceGrid } from './color-space-grid';

import imageUrl from '~/frontend/assets/CIExy1931-pristine-crop.png';

const imageId = 'CIE1933:image';

/**
 * https://company235.com/tools/colour/cie.html
 */
export const CIE1931: React.FC = props => {
  if (typeof window === 'undefined') {
    return null;
  }
  const canvasRef = useRef<HTMLCanvasElement>();
  const position = useMousePosition();

  const [debug, setDebug] = useState({ canvas: false, grid: false });
  const [selection, setSelection] = useState<XY>();
  const [rgba, rgbaFor] = useImageData(
    document.getElementById(imageId) as HTMLImageElement | undefined,
    xyFromDocumentPosition(position),
    [0.8, 0.8],
    canvasRef.current,
  );

  // TODO: display current state
  const currentState = useAllLightsColorSelection(selection);

  return (
    <>
      <Swatch
        rgba={currentState ? rgbaFor(currentState) : [0, 0, 0, 0.075]}
        position="fixed"
        bottom="calc(1vh + 1vw)"
        right="calc(1vh + 1vw)"
        zIndex={3}
      />

      <Cursor
        position={position}
        rgba={rgba}
        onClick={event => setSelection(xyFromDocumentPosition(event))}
      />

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
    </>
  );
};

const CurrentColor: React.FC<{ rgba?: RGBA }> = ({ rgba = [0, 0, 0, 0] }) => {
  return <Swatch rgba={rgba} position="fixed" top="1rem " right="1rem" />;
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

const documentPositionFromXY = ([x, y]: XY) => {
  const clientX = x * document.body.clientWidth;
  // TODO: invert: 1 - y somehow
  const clientY = document.body.clientHeight - y * document.body.clientHeight;

  return { clientX, clientY };
};
