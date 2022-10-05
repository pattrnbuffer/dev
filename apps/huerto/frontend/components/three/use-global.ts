import { atom, useAtom } from 'jotai';

export const depthAtom = atom<number>(5);

export const globalAtom = atom(get => {
  return {
    depth: get(depthAtom),
  };
});

export const useGlobal = () => {
  const [globals] = useAtom(globalAtom);

  return globals;
};
