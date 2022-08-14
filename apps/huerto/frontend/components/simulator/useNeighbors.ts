import { omitBy, mapValues } from 'lodash';
import { useMemo } from 'react';

import { Locator, Point, World, WorldBlock } from './types';
import { findBlockFor, useWorld } from './world';

export const useNeighbors = (locator: Locator) => {
  const world = useWorld();
  const { point } = findBlockFor(world, locator);

  return useMemo(() => mapLocality(world, point), [world, point]);
};

export function mapLocality(world: World, point: number[]) {
  const sides = mapDeltas(world, point, sidex);
  const edges = mapDeltas(world, point, edgex);
  const corners = mapDeltas(world, point, cornerx);

  return {
    sides,
    edges,
    corners,
    locals: { ...sides, ...edges, ...corners },
  };
}

export function mapDeltas<K extends Locals>(
  world: World,
  point: Point,
  deltaMap: Record<K, number[]>,
) {
  const values = mapValues(deltaMap, dxs => {
    if (point.length < dxs.length) return;

    if (point.length !== dxs.length) {
      point = [...dxs, 0].slice(0, dxs.length);
      dxs = [...dxs, 0].slice(0, point.length);
    }

    const block = findBlockFor(
      world,
      dxs.map((d, i) => point[i] + d).join(','),
    );

    if (block)
      return {
        block,
        distance: dxs.map(Math.abs).reduce((a, b) => a + b, 0) / point.length,
      };
  });

  return omitBy(values, v => !v) as Record<
    K,
    { block: WorldBlock; distance: number }
  >;
}

type Side = keyof typeof sidex;
type Edge = keyof typeof sidex;
type Corner = keyof typeof sidex;
type Locals = Side | Edge | Corner;
const sidex = {
  r: [1, 0],
  l: [-1, 0],
  u: [0, 1],
  d: [0, -1],
  f: [0, 0, 1],
  b: [0, 0, -1],
} as const;

const edgex = {
  ul: [-1, 1, 0],
  dl: [-1, -1, 0],
  ur: [1, 1, 0],
  dr: [1, -1, 0],
  fl: [-1, 0, 1],
  bl: [-1, 0, -1],
  fr: [1, 0, 1],
  br: [1, 0, -1],
} as const;

const cornerx = {
  ful: [-1, 1, 1],
  fur: [1, 1, 1],
  bul: [-1, 1, 1],
  bur: [1, 1, 1],
  fdl: [-1, -1, 1],
  fdr: [1, -1, 1],
  bdl: [-1, -1, -1],
  bdr: [1, -1, -1],
} as const;
