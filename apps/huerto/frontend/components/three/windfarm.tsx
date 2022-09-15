import { FC, useEffect, useMemo, useState } from 'react';
import { Vector3 } from 'three';

import { Box } from './box';
import { GridProps, GridElementProps } from './grid';
import { useMeshObserver } from './mesh';

type WindfarmProps = GridProps;

export const Windfarm: FC<WindfarmProps> = ({
  size: length = 4,
  unit = 1,
  as: Element = Box,
}) => {
  const [weather, setWeather] = useState<
    { x: number; y: number; i: number; speed: number }[]
  >(() => Array.from({ length }));
  const rotationRates = useMemo(() => rotationRatesFor(weather), [weather]);
  const list = Array.from({ length }).flatMap((_, x) =>
    Array.from({ length }).map((_, y) => {
      return [x, y];
    }),
  );
  const offset = ((length - 1) / 2) * unit;

  return (
    // does not come with group context baked in
    <>
      {list.map(([x, y], i) => (
        <Element
          key={[x, y, i].join()}
          position={[x, y, 0]}
          translate={[-offset, -offset, 0]}
          rotator={[-1, 0, 0, rotationRates?.[i] ?? 0.125]}
        >
          <Anemometer
            onChange={({ speed }) => {
              setWeather(weather => {
                weather = [...weather];
                weather[i] = { x, y, i, speed };
                return weather;
              });
            }}
          />
        </Element>
      ))}
    </>
  );
};

type AnemometerProps = {
  onChange: (props: { speed: number }) => void;
};
const Anemometer: FC<AnemometerProps> = ({ onChange }) => {
  const { state, history } = useMeshObserver();

  history.reduceRight((acc, st, i, list) => {
    const { 0: first, [i - 1]: prev, [i + 1]: next, [length - 1]: last } = list;
    return acc;
  }, []);

  useEffect(() => {
    onChange({ speed: state.wheel });
  }, [state]);

  return null;
};

type Weather = {
  x: number;
  y: number;
  i: number;
  speed: number;
};
function rotationRatesFor(weather: Weather[]) {
  return weather.map((cell, i, c) => {
    if (!cell) return;
    const peeps = peers(weather, [cell.x, cell.y]);
    return (
      peeps.reduce((sum, peer) => sum + (peer?.speed ?? 0), 0) / peeps.length
    );
  });
}

function peers<T extends { x: number; y: number }>(
  weather: T[],
  [x, y]: number[],
) {
  return [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    // [0, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ].map(([dx, dy]) => {
    return weather.find(v => v?.x === x + dx && v?.y === y + dy);
  });
}
