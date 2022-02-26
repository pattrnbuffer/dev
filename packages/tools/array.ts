type Condition<T> = (v: T, i: number, c: T[]) => boolean;

/**
 * TODO: move to @dev/tools
 */
export const array = {
  size<T>(v?: T[] | null | undefined) {
    return v?.length ?? 0;
  },

  some<T>(...allConditions: Condition<T>[]) {
    const conditioner: Condition<T> = (v, i, c) => {
      return allConditions.some(cond => cond(v, i, c));
    };

    return (source: T[]) => source.some(conditioner);
  },

  none<T>(...allConditions: Condition<T>[]) {
    const some = array.some(...allConditions);

    return (source: T[]) => !some(source);
  },

  isEmpty<T extends any[] | null | undefined>(v?: T): v is T {
    return array.size(v) < 1;
  },

  isNonEmpty<T extends any[] | null | undefined>(v?: T): v is T {
    return !array.isEmpty(v);
  },
};
