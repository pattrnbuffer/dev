import { atom } from 'jotai';
import { createEventsListener } from '~/frontend/tools';
import { floor, round } from '../tools';

const mousePrecisionAtom = atom(2);
const mousePositionAtom = atom([0, 0]);

export const mouseAtom = atom(
  get => ({ position: get(mousePositionAtom) }),
  (get, set, [x, y]: number[]) => {
    const precision = get(mousePrecisionAtom);
    set(
      mousePositionAtom,
      [x, y].map(v => round(v, precision)),
    );
  },
);
mouseAtom.onMount = set =>
  createEventsListener(['mousemove', 'mouseenter'], event =>
    set([
      event.clientX / window.innerWidth,
      event.clientY / window.innerHeight,
    ]),
  );
