export type Board = {
  size: number[];
};
export type World = {
  id: number;
  board: Board;
  blockMap: Record<string, WorldBlock>;
};
export type WorldBlock = {
  address: Address;
  point: Point;
  color: Color;
};

export type Locator = Address | { address: Address };

export type BlockMap = Record<Address, WorldBlock>;
export type Color = number[];
export type Dimensions = Point; // [number] | [number, number] | [number, number, number];
export type Point = number[];
export type Address = string; // of dimensions [width, depth, height]
