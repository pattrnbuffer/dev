import { atom, useAtom, useSetAtom, WritableAtom } from 'jotai';
import { useMemo } from 'react';
import { BlockProps } from './props';

export type Block = {
  type: 'block';
  key: string;
  position: number[];
  props: BlockProps;
};

// export type BlockAtom<
//   Value extends Block = Block,
//   Update extends BlockUpdate = BlockUpdate,
// > = WritableAtom<Value, SetStateAction<Update>>;
export type BlockAtom = WritableAtom<Block, Block>;

export type BlockUpdate = Partial<Block> & Pick<Block, 'position'>;

const blocksAtom = atom<Record<string, BlockAtom>>({
  // [1,1,1]: { … position: [1, 1, 1] }
});
export const useAllBlockReset = () => {
  return useSetAtom(
    useMemo(() => atom(null, (_, set) => set(blocksAtom, {})), []),
  );
};

export const useAllBlockAtoms = () => {
  return useAtom(blocksAtom);
};

const empty: Block = { type: 'block', key: '', position: [], props: {} };

export const setBlockAtom = atom(null, (get, set, update: BlockUpdate) => {
  const key = update.key ?? String(update.position);
  const blocks = get(blocksAtom);
  const source = blocks[key];

  if (source && update) {
    set(source, { ...get(source), ...update });
  } else {
    const blockAtom: BlockAtom = atom<Block>({
      ...empty,
      ...update,
      key,
    });

    set(blocksAtom, { ...blocks, [key]: blockAtom });
  }
});

export function useBlockAtom(key: string) {
  return useAtom(
    useMemo(() => {
      return atom(get => get(blocksAtom)[key]);
    }, [key]),
  );
}
