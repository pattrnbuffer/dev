import { atom } from 'jotai';
import { createEventsListener } from '~/frontend/tools';

const mousePositionAtom = atom([0, 0]);

export const mouseAtom = atom(
  get => ({ position: get(mousePositionAtom) }),
  (_, set, [x, y]: number[]) => set(mousePositionAtom, [x, y]),
);
mouseAtom.onMount = set =>
  createEventsListener(['mousemove', 'mouseenter'], event =>
    set([
      event.clientX / window.innerWidth,
      event.clientY / window.innerHeight,
    ]),
  );
