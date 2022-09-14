import { FC } from 'react';

import { Box } from './box';

export type GripProps = {
  size?: number;
  unit?: number;
};

export const Grid: FC<GripProps> = ({
  size: length = 4,
  unit = 1,
  ...props
}) => {
  const list = Array.from({ length }).flatMap((_, x) =>
    Array.from({ length }).map((_, y) => {
      return [x, y];
    }),
  );
  const offset = ((length - 1) / 2) * unit;

  return (
    <>
      {list.map(([x, y], i) => (
        <Box
          key={[x, y, i].join()}
          position={[x, y, 0]}
          translate={[-offset, -offset, 0]}
        />
      ))}
    </>
  );
};
