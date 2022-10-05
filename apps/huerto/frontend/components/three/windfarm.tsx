import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { Vector2, Vector3 } from 'three';

import { Box } from './box';
import { GridProps, GridElementProps } from './grid';
import { useMeshObserver } from './mesh';
import { Unbox } from './Unbox';

type WindfarmProps = GridProps & {
  children?: ReactNode;
  generator?: (weather: Weather[]) => (number | undefined)[];
};

export const Windfarm: FC<WindfarmProps> = ({
  size: length = 6,
  unit = 1,
  onClick,
  generator: generate = rotationRatesFor,
  children,
}) => {
  const [weather, setWeather] = useState<Weather[]>(() =>
    Array.from({ length }),
  );
  const turbines = useMemo(() => generate(weather), [weather]);
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
        <Box
          key={[x, y, i].join()}
          position={[x, y, 0]}
          translate={[-offset, -offset, 0]}
          rotator={[-1, 0, 0, turbines?.[i] ?? 0.125]}
          onClick={() => {
            onClick?.([x, y, i], { ...weather[i], turbines: turbines });
          }}
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
          {children}
        </Box>
      ))}
    </>
  );
};

type AnemometerProps = {
  onChange: (props: { speed: number }) => void;
};
const Anemometer: FC<AnemometerProps> = ({ onChange }) => {
  const { state, history } = useMeshObserver();

  const avg =
    history.slice(-4).reduce((speed, st, i, { [i - 1]: prev }) => {
      return speed + st.value.wheel;
    }, 0) / 4;

  useEffect(() => {
    onChange({ speed: avg });
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
