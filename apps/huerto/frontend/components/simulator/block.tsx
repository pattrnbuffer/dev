import { atom, useAtom, Atom } from 'jotai';
import { atomWithImmer } from 'jotai/immer';

import { Board, Locator, WorldBlock } from './types';

import {
  createContext,
  Dispatch,
  EffectCallback,
  FC,
  useContext,
  useEffect,
  useMemo,
} from 'react';

type BlockContextValue = { block?: Block };
const BlockContext = createContext<BlockContextValue>(
  undefined as unknown as BlockContextValue,
);

export type BlockProviderProps = { block: WorldBlock };
export const BlockProvider: FC<BlockProviderProps> = ({ block, children }) => {
  const value = useMemo(() => ({ block }), [block]);
  return (
    <BlockContext.Provider value={value}>{children}</BlockContext.Provider>
  );
};

export const useBlock = () => {
  const { block } = useContext(BlockContext);

  return block;
};
