type Map2DPoint<K> = { x: K; y: K };
type Map2DValue<T> = Record<string, T>;

type Mapped<T, K extends string | number = number> = {
  get(point: { x: K } | { y: K }): Record<K, T>;
  get(point: { x: K; y: K }): T;

  set(point: { x: K; y: K }): Mapped<T, K>;
};

export const createMap2D = <
  T,
  K extends string | number = string | number,
>() => {
  const XS = {} as Record<K, Record<K, T>>;
  const YS = {} as Record<K, Record<K, T>>;

  const mapping = <Mapped<T, K>>{
    get(p: { x: K; y: K } | { x: K } | { y: K }) {
      if ('x' in p && 'y' in p && p.x != null && p.y != null) {
        return XS[p.x]?.[p.y];
      }
      if ('x' in p && p.x != null) {
        return (XS[p.x] ??= {} as Record<K, T>);
      }
      if ('y' in p && p.y != null) {
        return (YS[p.y] ??= {} as Record<K, T>);
      }
    },
    set({ x, y }: { x: K; y: K }, value: T) {
      XS[x] = { ...XS[x], [y]: value };
      YS[y] = { ...YS[y], [x]: value };
      return mapping;
    },
  };

  return mapping;
};

const map = createMap2D<'hello'>();

const v = map.get({ x: 1 },, 1);
