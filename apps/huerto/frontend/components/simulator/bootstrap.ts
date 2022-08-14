import { forEachDimension, reduceDimension } from './dimension';
import {
  Address,
  Board,
  Color,
  BlockMap,
  Dimensions,
  Point,
  World,
  WorldBlock,
} from './types';

export function createWorld(board: Board, createBlock = blockFor): World {
  let blockMap: Record<Address, WorldBlock> = {};

  const [width, depth, height] = board.size;

  if (width > 0)
    for (let x = 0; x < width; x++)
      if (depth > 0)
        for (let y = 0; y < depth; y++)
          if (height > 0)
            for (let z = 0; z < height; z++) {
              const block: WorldBlock = createBlock(board.size, [x, y, z]);
              blockMap[block.address] = createBlock(board.size, [x, y, z]);
            }
          else {
            const block: WorldBlock = createBlock(board.size, [x, y]);
            blockMap[block.address] = createBlock(board.size, [x, y]);
          }
      else {
        const block: WorldBlock = createBlock(board.size, [x]);
        blockMap[block.address] = createBlock(board.size, [x]);
      }

  return {
    id: 0,
    board: board,
    blocks: blockMap,
  };
}

function blockFor(size: Dimensions, point: Point, color?: Color): WorldBlock {
  return {
    point,
    address: point.join(','),
    color: color ?? blockColorFor(size, point),
  };
}

const ChannelBias = [0.1, 0.65, 0.76];
const AxisBias = [0.5, 0.9, 0.5];

function blockColorFor(dimensions: number[], point: number[]): Color {
  const [r, g, b] = [...point, 0].slice(0, 3).map((value, i) => {
    const dim = vomean(dimensions, i);
    const abias = vomean(AxisBias, i);
    const cbias = vomean(ChannelBias, i);
    const scale = ((value || 1) / dim + 0.5) % 1;

    // value = 127 * scale + 127 * abias + 127 * cbias;
    value = 127 * scale + 127 * abias + 127 * cbias;
    return value;
  });

  return [r, g, b, 1];
}

function vomean(source: number[], index: number): number {
  return source[index] ?? source.reduce((a, b) => a + b, 0) / source.length;
}
