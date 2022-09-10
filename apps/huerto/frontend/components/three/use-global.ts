import { atom, useAtom } from 'jotai';

const depthAtom = atom<number>(5);

const globalAtom = atom(get => {
  return {
    depth: get(depthAtom),
  };
});

export const useGlobal = () => {
  const [globals] = useAtom(globalAtom);

  return globals;
};
