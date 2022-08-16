import { merge } from 'lodash';
import { Atom, atom, PrimitiveAtom, useAtom } from 'jotai';
import { atomWithImmer } from 'jotai/immer';
import { useMemo } from 'react';
import { BlockProps } from './props';

export type Block = {
  type: 'block';
  key: string;
  position: number[];
  props: BlockProps;
};

export type BlockAtom = Atom<Block>;

export type BlockAtomInput = Partial<Block> & Pick<Block, 'position'>;

const blocksAtom = atomWithImmer<Record<string, PrimitiveAtom<Block>>>({
  // [1,1,1]: { … position: [1, 1, 1] }
});

export const setBlockAtom = atom(null, (get, set, update: BlockAtomInput) => {
  const key = update.key ?? String(update.position);
  const blocks = get(blocksAtom);
  const source = blocks[key];

  if (source && update) {
    set(source, { ...get(source), ...update });
  } else {
    set(blocksAtom, {
      ...blocks,
      [key]: atom({ ...empty, ...update, key }),
    });
  }
});

export const useAllBlockAtoms = () => {
  return useAtom(blocksAtom);
};

export function useBlockAtom(key: string) {
  return useAtom(
    useMemo(() => {
      return atom(get => get(blocksAtom)[key]);
    }, [key]),
  );
}

const empty: Block = { type: 'block', key: '', position: [], props: {} };
