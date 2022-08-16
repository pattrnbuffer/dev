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
  const surface = position.map((v, i) => v / dimensions[i]);
  const pairs = surface.map((v, i) => [lens[i] ?? 0.5, v]);

  // distance between two points
  // d = √[(x2 − x1)2 + (y2 − y1)2 + (z2 − z1)2]
  return Math.sqrt(
    pairs.map(([a1, a2]) => (a1 - a2) ** 2).reduce((a, b) => a + b, 0),
  );
}
