export type Board = {
  size: number[];
};
export type World = {
  board: Board;
  blocks: Record<string, WorldBlock>;
};
export type WorldBlock = {
  address: Address;
  point: Point;
  color: Color;
};

export type Color = string;
export type Dimensions = number[]; // [number] | [number, number] | [number, number, number];
export type Point = Dimensions;
export type Address = string; // of dimensions [width, depth, height]
