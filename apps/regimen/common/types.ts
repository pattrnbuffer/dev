type Index = number | symbol | string;
type Primitive = boolean | Index;

export type Fragment<T> = T & {
  [key: Index]: Primitive | Primitive[] | Fragment<Primitive>;
};
