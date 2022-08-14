import { Board, Point } from './types';

type OnBlock = (point: number[]) => void;
type ReduceBlock<A> = (acc: A, point: Point) => A;

function forEachDimension(board: Board, onBlock: OnBlock): void;
function forEachDimension(
  board: Board,
  point: Point | undefined,
  onBlock: OnBlock,
): void;
function forEachDimension(
  board: Board,
  a?: OnBlock | Point,
  b?: OnBlock | Point,
) {
  if (board.size.length === 0) return;

  const point = Array.isArray(a) ? a : [];
  const onBlock = (typeof a === 'function' ? a : b) as OnBlock;

  const [D, ...size] = board.size;

  for (let x = 0; x < D; x++) {
    onBlock([...point, x]);
    forEachDimension({ ...board, size }, point, () => onBlock([...point, x]));
  }
}

function reduceDimension<A>(board: Board, reduce: ReduceBlock<A>): A;
function reduceDimension<A>(
  board: Board,
  point: Point,
  reduce: ReduceBlock<A>,
): A;
function reduceDimension<A>(
  board: Board,
  a: ReduceBlock<A> | Point,
  b?: ReduceBlock<A>,
): A {
  const point = Array.isArray(a) ? a : undefined;
  const reduce = (typeof a === 'function' ? a : b) as ReduceBlock<A>;

  let acc: A = {} as A;
  forEachDimension(board, point, point => {
    acc = reduce(acc, point);
  });

  return acc;
}

export { forEachDimension, reduceDimension };
