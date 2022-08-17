import { atom, useAtom } from 'jotai';
import { useEffect, useMemo } from 'react';
import { useBoardValue } from './board';

export function useKittyCat() {
  const { size } = useBoardValue();
  const [cat, setCat] = useAtom(
    useMemo(() => {
      const catAtom = atom(
        {
          key: '',
          focus: [0.5, 0.5],
          delta: [0, 0],
          position: size.map(v => Math.floor(v / 2)),
          destination: size.map(v => Math.floor(v / 2 + 1)),
        },
        (get, set) => {
          let { delta, destination, position, ...rest } = get(catAtom);

          if (Math.random() > 0.9) {
            return;
          } else if (destination.some((v, i) => v !== position[i])) {
            delta = destination.map((v, i) => {
              return Math.max(-1, Math.min(v - position[i], 1));
            });
            position = delta.map((d, i) => {
              return Math.max(0, Math.min(position[i] + delta[i], size[i]));
            });
          } else {
            destination = size.map(v => Math.floor(v * Math.random()));
          }

          set(catAtom, {
            ...rest,
            key: String(position),
            delta,
            position,
            destination,
            focus: position.map((v, i) => v / size[i]).reverse(),
          });
        },
      );

      return catAtom;
    }, [size]),
  );

  useEffect(() => {
    // TODO world tick
    const id = setInterval(() => {
      setCat(Math.random());
    }, 200);

    return () => clearInterval(id);
  });

  return cat;
}
