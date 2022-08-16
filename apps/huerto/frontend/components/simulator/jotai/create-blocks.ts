export function mapPositions<T>(
  dimensions: number[],
  createBlock: (position: number[]) => T,
) {
  const results: T[] = [];

  forEachPosition(dimensions, position => {
    results.push(createBlock(position));
  });

  return results;
}

export function forEachPosition<T>(
  dimensions: number[],
  createBlock: (position: number[]) => T,
  position: number[] = [],
) {
  let scale = dimensions[position.length];
  if (scale == null) createBlock(position);
  else
    for (let di = 0; di < scale; di++)
      forEachPosition(dimensions, createBlock, [...position, di]);
}
