import { atom, PrimitiveAtom, useAtom } from 'jotai';

type Stage = 'mounted' | 'created' | 'unmounted';
type Board = { id: string; size: Dimensions };
type Dimensions = number[];

export const stageAtom = atom<Stage>('mounted');
export const boardAtom = atom<Board>({ id: '0', size: [0] });

export const appAtom = atom(get => {
  return {
    // serialized app state to trigger reset
    id: 0,
    stage: get(stageAtom),
    board: get(boardAtom),
  };
});

const boardValue = atom(get => get(boardAtom));
export const useBoardValue = () => {
  const [board] = useAtom(boardValue);
  return board;
};
