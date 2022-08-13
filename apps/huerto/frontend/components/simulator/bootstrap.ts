import {
  Address,
  Board,
  Color,
  Dimensions,
  Point,
  World,
  WorldBlock,
} from './types';

export const world = bootstrap({ size: [3, 5] });
console.log(world);

function mapDimensions(
  board: Board & { point?: Point },
  onBlock: (point: number[]) => void,
) {
  if (board.size.length === 0) return;

  const [D, ...size] = board.size;
  const point = board.point ?? [];

  for (let x = 0; x < D; x++) {
    mapDimensions({ size, point: [...point, x] }, () => {
      onBlock([...point, x]);
    });
  }
}

function bootstrap(board: Board): World {
  const blockMap: Record<Address, WorldBlock> = {};

  const [width, depth, height] = board.size;

  if (width > 0)
    for (let x = 0; x < width; x++)
      if (depth > 0)
        for (let y = 0; y < depth; y++)
          if (height > 0)
            for (let z = 0; z < height; z++) {
              const block: WorldBlock = blockFor([x, y, z]);
              blockMap[block.address] = blockFor([x, y, z]);
            }
          else {
            const block: WorldBlock = blockFor([x, y]);
            blockMap[block.address] = blockFor([x, y]);
          }
      else {
        const block: WorldBlock = blockFor([x]);
        blockMap[block.address] = blockFor([x]);
      }

  return {
    board: board,
    blocks: blockMap,
  };
}

function blockFor(point: Point, color?: Color): WorldBlock {
  return {
    point,
    address: point.join(','),
    color: blockColorFor(point),
  };
}

function blockColorFor([x = 0, y = 0, z = 0]: number[]): Color {
  const [r, g, b] = [x, y, z].map(x => ((x + 1) * 127) % 255);
  return `rgba(${r}, ${g}, ${b}, 1)`;
}
