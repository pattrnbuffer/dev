import { round } from './tools';

export function vectorFor(
  dimensions: number[],
  position: number[],
  lens: number[] = [],
) {
  const shouldLog = lens.every(v => v > 0.45 && v < 0.55);

  return dimensions.map((scale, i) => {
    const focus = lens[i % lens.length] ?? 0.5;
    // const point = position[i] ? position[i] / scale : 0.5;
    // return focus - point;
    // return 1 - Math.abs(focus - point);

    return (
      ((([...position].reverse()[i] ?? 0.5) + focus) / scale - focus) * scale
    );
  });
}

export function distanceFor(
  dimensions: number[],
  position: number[],
  lens: number[] = [],
) {
  lens = [...lens].reverse();
  // return distance(
  //   lens.map(v => v ?? 0.5),
  //   position.map((v, i) => v / dimensions[i]),
  // );
  const surface = position.map((v, i) => v / dimensions[i]);
  const pairs = surface.map((v, i) => [lens[i] ?? 0.5, v]);
  // distance between two points
  // d = √[(x2 − x1)^2 + (y2 − y1)^2 + (z2 − z1)^2]
  return Math.sqrt(
    pairs.map(([a1, a2]) => (a1 - a2) ** 2).reduce((a, b) => a + b, 0),
  );
}

function distance(...vectors: number[][]) {
  const difference = combine((a, b = 0) => a - b, vectors);
  console.log(vectors, difference);
  return Math.sqrt(difference.map(d => d ** 2).reduce((a, b) => a + b, 0));
}

function combine(
  operation: (a: number, b: number | undefined, i: number) => number,
  vectors: number[][],
) {
  const size = vectors.reduce((value, arr) => Math.max(value, arr?.length), 0);

  return Array.from({ length: size }).map((_, i) => {
    const value = vectors.reduce(
      (a, b) => operation(a, b[i] ?? undefined, i),
      0,
    );

    console.log('vectors, value', vectors, value);

    return value;
  });
}
