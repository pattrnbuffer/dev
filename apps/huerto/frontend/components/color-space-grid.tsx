import { useEffect, useMemo, useRef, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { Layer } from '../layer';

type ColorSpaceGridProps = {
  count?: number;
  convert: Converter;
};

type Converter = (xy: [number, number]) => string;

const defaultCount = 40;
export const ColorSpaceGrid: React.FC<ColorSpaceGridProps> = ({
  count = defaultCount,
  convert,
}) => {
  return (
    <Box
      display="flex"
      flexDir="column"
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      width="100vw"
      height="100vh"
      zIndex={Layer.Debug}
    >
      {/* <ColorGrid count={count} convert={convert} /> */}
      <ColorFlexGrid count={count} convert={convert} />
    </Box>
  );
};

const ColorGrid: React.FC<{ count: number; convert: Converter }> = ({
  count,
  convert,
}) => (
  <Box flex="1" display="grid" gridTemplateColumns={`repeat(${count}, 1fr)`}>
    {useMemo(
      () =>
        Array(count * count)
          .fill(0)
          .map((_, index) => {
            const xi = index % count;
            const yi = Math.floor(index / count);
            return (
              <ColorTile
                key={String([count, xi, yi])}
                convert={convert}
                count={count}
                x={xi}
                y={yi}
              />
            );
          }),
      [count, convert],
    )}
  </Box>
);

const ColorFlexGrid: React.FC<{ count: number; convert: Converter }> = ({
  count,
  convert,
}) => (
  <>
    {useMemo(
      () =>
        Array(count)
          .fill(0)
          .map((_, yi) => {
            return (
              <Box
                key={String([count, yi])}
                display="flex"
                flex="1"
                flexDir="row"
              >
                {Array(count)
                  .fill(0)
                  .map((_, xi) => (
                    <ColorTile
                      key={String([count, xi, yi])}
                      convert={convert}
                      count={count}
                      x={xi}
                      y={yi}
                    />
                  ))}
              </Box>
            );
          }),
      [count, convert],
    )}
  </>
);

type ColorTileProps = {
  convert: Converter;
  count: number;
  x: number;
  y: number;
};

const ColorTile: React.FC<ColorTileProps> = ({ convert, count, x, y }) => {
  const [color, setColor] = useState('rgba(255, 255, 255, 0)');

  const boxRef = useRef<HTMLDivElement>();
  useEffect(() => {
    const lx = x / count;
    const ly = (count - y) / count;
    setColor(convert([lx, ly]));
  }, [convert, count, x, y]);

  const size =
    0.8 *
    Math.min(
      boxRef.current?.clientWidth ?? 0,
      boxRef.current?.clientHeight ?? 0,
    );

  return (
    <Box
      ref={v => (boxRef.current = v ?? undefined)}
      flex="1"
      display="flex"
      alignItems="center"
      justifyContent="center"
      transform="translate(-50%, -50%)"
    >
      <Box
        flex="1"
        width="100%"
        height="100%"
        maxWidth={size || '80%'}
        maxHeight={size || '80%'}
        borderRadius="100%"
        style={{ backgroundColor: color }}
      />
    </Box>
  );
};
