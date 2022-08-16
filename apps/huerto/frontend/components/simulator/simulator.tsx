import { Box, styled } from '@chakra-ui/react';
import { atom, useAtom, useSetAtom } from 'jotai';
import { FC, useEffect, useState } from 'react';
import { useMousePosition } from '~/frontend/hooks';
import { tileColors, rgba, generateColor } from './color';
import { createWorld } from './create-world';
import { BoxTile } from './elements';
import {
  useAllBlockAtoms,
  setBlockAtom,
  useBlockAtom,
  BlockAtom,
} from './jotai';
import { useBoardValue, boardAtom, stageAtom } from './jotai/board';
import { forEachPosition } from './jotai/create-blocks';
import { mouseAtom } from './jotai/mouse';
import { Board, Locator } from './types';
import { useNeighbors } from './useNeighbors';
import { vectorFor } from './vector';
import { useBlockState, useWorldSize, WorldProviderProps } from './world';

export const Simulator: FC<WorldProviderProps> = ({ board, interval }) => {
  const [stage, setStage] = useAtom(stageAtom);
  const setBoard = useSetAtom(boardAtom);
  const setBlock = useSetAtom(setBlockAtom);

  useEffect(() => {
    setBoard(board);
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
              affinity: Math.random(),
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
  const [mouse] = useAtom(mouseAtom);
  const [blockMap] = useAllBlockAtoms();

  return (
    <>
      {Object.entries(blockMap).map(([key, atom]) => (
        <Block key={key} atom={atom} focus={mouse.position}></Block>
      ))}
    </>
  );
};

const Block: FC<{ atom: BlockAtom; focus: number[] }> = ({
  atom,
  focus: [fx, fy],
}) => {
  // or with a blockKey prop useBlockAtom(blockKey);
  const { size: [width, height, ...rest] = [] } = useBoardValue();
  const [block] = useAtom(atom);
  const {
    position: [x, y],
  } = block;
  [fy, fx] = [fx, fy];
  const affinities = vectorFor(
    [width, height, ...rest],
    block.position,
    // why did this need to be revered?
    [fx, fy],
  );
  const [ax, ay] = affinities;

  // console.log('fy, fx', fy, fx);
  // console.log('ay, ax', ay, ax);
  // console.log('1 / width', 1 / width);
  // console.log('1 / height', 1 / height);
  // const tx = Math.cos(Math.abs((x + fx) / (width + 1)));
  // const ty = Math.cos(Math.abs((y + fy) / (height + 1)));
  // const txy = Math.cos(Math.abs((x + y + fx + fy) / (width + height + 2)));
  // if (x === 0 && y === 0) {
  //   console.log('txy', txy);
  // }
  // console.log('tx, ty', tx, ty);

  const alpha = 1 - (Math.abs(ax / width) + Math.abs(ay / height));
  // const alpha = txy;

  return (
    <BoxTile
      style={{
        minWidth: `calc(100vw / ${width})`,
        minHeight: `calc(100vh / ${height})`,
        backgroundColor: rgba(block.props.color?.value ?? []),
        opacity: alpha,
      }}
    >
      <BoxTile gap="1rem">
        {affinities.map((v, i) => (
          <Box key={i} fontSize=".5rem">
            {Math.round(100 * v) / 100}
          </Box>
        ))}
      </BoxTile>
    </BoxTile>
  );
};
