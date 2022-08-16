export type BlockProps = {
  selected?: SelectProp;
  color?: ColorProp;
};

export type SelectProp = {
  selected: boolean;
};

export type ColorProp = {
  value: number[];
  affinity: number;
  integrity: number;
};
