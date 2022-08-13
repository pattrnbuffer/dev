import { world } from './bootstrap';

export const useWorld = () => {
  return world;
};

export const useWorldSize = () => {
  const world = useWorld();
  return world.board.size;
};
