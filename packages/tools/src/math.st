import is from '@sindresorhus/is';
// import { array } from './array';
// console.table(
//   manifold(
//     [0, 0.25, 0.5, 0.75, 1],
//     [
//       ['sin', Math.sin],
//       ['cos', Math.cos],
//     ],
//   ),
// );

/// takes map of values
// takes map of functions to perform
// functions can reference previously defined in an ordered mapping

type Tuple = number | number[];
type Operation<R extends Tuple> = (value: number) => R;
type OperationRef<K extends string, R extends Tuple = number> = [
  K,
  Operation<R>,
];
type OperationSet<K extends string, R extends Tuple = number> = [
  Operation<R> | OperationRef<K, R>,
];

function manifold<K extends string, OK extends string>(
  values: number[] | Record<K, number>,
  operations: OperationSet<OK>,
) {
  const value = Object.entries<number>(values).map(([$0, value]) => {
    const name = $0 as K;
    return [
      name,
      Object.entries(operations).map(([$0, operation]) => {
        const operationName = $0 as OK;

        return [operationName, $(operation, value)] as const;
      }),
    ] as const;
  });

  // return Object.fromEntries(
  //   value.map(([name], k) => {
  //     return;
  //   }),
  // );
}

function $<K extends string, R extends Tuple = number>(
  $0: Operation<R> | OperationRef<K, R>,
  $1: Tuple,
) {
  const operator = is.array($0) ? $0[1] : $0;
  const values = array.from($1);
  const result = values.map(v => operator(v));
  if (isMultiplex<R>(result)) {
    return result;
  } else {
    return result[0] as R;
  }
}

function mapReduce() {}

const isMultiplex = <R>(v: unknown): v is R[] =>
  is.arrayLike(v) && v.length > 1;
