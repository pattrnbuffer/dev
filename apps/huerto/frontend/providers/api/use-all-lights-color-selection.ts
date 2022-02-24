import { useEffect } from 'react';

export function useAllLightsColorSelection(selection?: [number, number]) {
  useEffect(() => {
    if (selection?.length) {
      let [x, y] = selection.map(v => round(v));

      x = Math.min(x * 1.2, 1);
      y = Math.min(y * 0.85, 1);

      fetch(`/api/hue/all-lights-color/${x}/${y}`);
    }
  }, [selection]);
}

function round(value, degree = 100) {
  return Math.round(value * degree) / degree;
}
