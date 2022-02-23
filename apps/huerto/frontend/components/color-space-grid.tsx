import { useEffect, useMemo, useState } from 'react';
import { Box } from '@chakra-ui/react';

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
      zIndex={1}
    >
      {useMemo(
        () =>
          Array(count)
            .fill(0)
            .map((_, yi) => {
              return (
                <Box key={yi} display="flex" flex="1" flexDir="row">
                  {Array(count)
                    .fill(0)
                    .map((_, xi) => (
                      <ColorTile
                        key={[xi, yi].join('.')}
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
    </Box>
  );
};

type ColorTileProps = {
  convert: Converter;
  count: number;
  x: number;
  y: number;
};

const ColorTile: React.FC<ColorTileProps> = ({ convert, count, x, y }) => {
  const [color, setColor] = useState('rgba(255, 255, 255, 0)');

  useEffect(() => {
    const lx = x / count;
    const ly = (count - y) / count;
    setColor(convert([lx, ly]));
  }, [convert, count, x, y]);

  return (
    <Box
      key={[x, y].join()}
      flex="1"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        width="100%"
        height="100%"
        maxWidth="60%"
        maxHeight="60%"
        backgroundColor={color}
        borderRadius="50%"
      />
    </Box>
  );
};
