import { useEffect, useState } from 'react';

export function useAllLightsColorSelection(selection?: [number, number]) {
  const [state, setState] = useState<[number, number]>();
  useEffect(() => {
    if (selection?.length && selection !== state) {
      let [x, y] = selection.map(v => round(v));

      x = Math.min(x, 1);
      y = Math.min(y, 1);

      // TODO: useMountedState from @dev/hooks
      fetch(`/api/hue/all-lights-color/${x}/${y}`).then(() =>
        setState(selection),
      );
    }
  }, [selection]);

  return state;
}

function round(value: number, degree = 1000) {
  return Math.round(value * degree) / degree;
}
