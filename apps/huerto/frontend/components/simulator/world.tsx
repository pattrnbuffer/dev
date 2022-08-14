import { World, Board, WorldBlock, Locator } from './types';
import { createWorld } from './bootstrap';
import {
  createContext,
  Dispatch,
  EffectCallback,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useInterval } from '@chakra-ui/react';

type WorldContextValue = readonly [World, Dispatch<UpdateWorldAction>];
type UpdateWorldAction =
  | Partial<WorldBlock>
  | ((world: World) => Partial<WorldBlock>);

const WorldContext = createContext<WorldContextValue>([
  undefined as unknown as World,
  () => {
    throw new Error('Add <WorldProvider/> to enable useWorld');
  },
]);

export type WorldProviderProps = { board: Board; interval?: number };
export const WorldProvider: FC<WorldProviderProps> = ({
  board,
  interval,
  children,
}) => {
  const [world, setWorld] = useState(() => createWorld(board));
  const [blockUpdates, setBlockUpdates] = useState<WorldBlock[]>([]);

  useEffect(() => {
    if (board.size.some((v, i) => v !== world.board.size[i])) {
      const world = createWorld(board);
      setWorld(world);
      setBlockUpdates([]);
    }
  }, [board.size]);

  // useInterval(() => {
  //   setWorld(world => {
  //     return blockUpdates.length === 0
  //       ? world
  //       : {
  //           ...world,
  //           id: world.id + 1,
  //           blocks: blockUpdates.reduce(
  //             (acc, v) => {
  //               acc[v.address] = v;
  //               return acc;
  //             },
  //             { ...world.blocks },
  //           ),
  //         };
  //   });
  //   setBlockUpdates([]);
  // }, interval ?? 200);

  const value = useMemo(
    () =>
      [
        world,
        (action: WorldBlock | ((world: World) => WorldBlock)) => {
          const block = typeof action === 'function' ? action(world) : action;

          setBlockUpdates(blocks => [...blocks, block]);
        },
      ] as const,
    [world],
  );
  return (
    <WorldContext.Provider value={value}>{children}</WorldContext.Provider>
  );
};

export const useWorld = () => {
  const [world] = useContext(WorldContext);

  return world;
};

export const useWorldSize = () => {
  const world = useWorld();
  return world.board.size;
};

export const useWorldTick = (effect: EffectCallback) => {
  const world = useWorld();

  useEffect(effect, [world.id]);
};

export const useBlockState = (locator: Locator, update?: WorldBlock) => {
  const [world, setBlock] = useContext(WorldContext);
  const block = findBlockFor(world, locator) ?? update;

  return useMemo(() => {
    return [
      block,
      (update: Partial<Omit<WorldBlock, 'address'>>) => setBlock(update),
    ] as const;
  }, [block]);
};

export const findBlockFor = (world: World, locator: Locator) => {
  return typeof locator === 'string'
    ? world.blocks[locator]
    : world.blocks[locator.address];
};
