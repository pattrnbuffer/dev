import { Box } from '@chakra-ui/react';
import { atom, useAtom, useSetAtom } from 'jotai';
import { FC, useEffect } from 'react';
import { generateColor, rgba, tileColors } from './color';
import { BoxTile, KittyCat } from './elements';
import {
  BlockAtom,
  setBlockAtom,
  useAllBlockAtoms,
  useAllBlockReset,
} from './jotai';
import { boardAtom, stageAtom, useBoardValue } from './jotai/board';
import { forEachPosition } from './jotai/create-blocks';
import { useKittyCat } from './jotai/kitty-cat';
import { mouseAtom } from './jotai/mouse';
import { round } from './tools';
import { distanceFor } from './vector';
import { WorldProviderProps } from './world';

export const Simulator: FC<WorldProviderProps> = ({ board, interval }) => {
  const [stage, setStage] = useAtom(stageAtom);
  const setBoard = useSetAtom(boardAtom);
  const setBlock = useSetAtom(setBlockAtom);
  const resetBlocks = useAllBlockReset();

  useEffect(() => {
    setStage('mounted');
    setBoard(board);
    resetBlocks();
  }, [String(board.size)]);

  useEffect(() => {
    if (stage === 'mounted') {
      setStage('created');
      forEachPosition(board.size, position => {
        const color = generateColor(tileColors, position, (a, b) => {
          const magic = Math.round((Math.sin(b) % Math.cos(a)) + Math.tan(a));
          return a + b + magic;
        });

        setBlock({
          position,
          props: {
            color: {
              energy: Math.random(),
              integrity: Math.random(),
              value: color,
            },
          },
        });
      });
    }
    return () => setStage('mounted');
  }, []);

  return (
    <>
      <BlockMap />
    </>
  );
};

export const BlockMap: FC = () => {
  // const [mouse] = useAtom(mouseAtom);
  const [blockMap] = useAllBlockAtoms();
  const cat = useKittyCat();
  return (
    <>
      {Object.entries(blockMap).map(([key, atom]) => (
        <Block
          key={key}
          atom={atom}
          // would be used by an agent walking the room
          // focus={mouse.position}
          focus={cat.focus}
        >
          {key === cat.key && <KittyCat delta={cat.delta} />}
        </Block>
      ))}
    </>
  );
};

const Block: FC<{ atom: BlockAtom; focus: number[] }> = ({
  atom,
  focus,
  children,
}) => {
  // or with a blockKey prop useBlockAtom(blockKey);
  const {
    size = [],
    size: [width, height],
  } = useBoardValue();
  const [{ position, props }] = useAtom(atom);

  const distance = round(distanceFor(size, position, focus), 4);

  return (
    <BoxTile
      style={{
        minWidth: `calc(100vw / ${width})`,
        minHeight: `calc(100vh / ${height})`,
        backgroundColor: rgba(props.color?.value ?? []),
        opacity: Math.max(0.1, (1 - distance) ** 4),
      }}
    >
      <BoxTile gap="1rem">
        <Box fontSize="0.5rem" fontWeight="900">
          {distance}
        </Box>
      </BoxTile>
      {children}
    </BoxTile>
  );
};

// function unused__affinity_relevance() {
// TODO: why do I have to flip the dimensions? [fy, fx]
// const affinities = vectorFor(size, position, focus);
// const relevance = Math.sqrt(affinities.reduce((sum, b) => sum + b ** 2, 0));
// const relevance =
//   1 -
//   affinities.reduce(
//     (alpha, affinity, i) => alpha + Math.abs(affinity ** 2 / size[i]),
//     0,
//   );
/* {affinities.map((v, i) => (
          <Box key={i} fontSize=".5rem">
            {round(v)}
          </Box>
        ))} */
// }
