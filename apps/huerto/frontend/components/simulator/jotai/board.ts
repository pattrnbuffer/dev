import { atom, PrimitiveAtom, useAtom } from 'jotai';

type Stage = 'mounted' | 'created' | 'unmounted';
type Board = { size: Dimensions };
type Dimensions = number[];

export const stageAtom = atom<Stage>('mounted');
export const boardAtom = atom<Board>({ size: [0] });

const boardValue = atom(get => get(boardAtom));
export const useBoardValue = () => {
  const [board] = useAtom(boardValue);
  return board;
};