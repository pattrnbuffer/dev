import { FC } from 'react';
import { Vector3 } from 'three';

import { Box } from './box';
import { GridProps, GridElementProps } from './grid';

type ElectricGridProps = GridProps & {
  as: FC<ElectricGridElementProps>;
};
type ElectricGridElementProps = GridElementProps;

export const ElectricGrid: FC<ElectricGridProps> = ({
  size: length = 4,
  unit = 1,
  as: Element = Box,
}) => {
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
        />
      ))}
    </>
  );
};
