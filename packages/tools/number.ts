export const number = {
  add,
  subtract,
  multiply,
  divide,
  operate,
  typeOf: isNumber,
  valueOf: toNumber,
};

type Operator = (a: number, b: number) => number;
type ListOrValue<U, A, B = unknown> = A extends U[]
  ? U[]
  : B extends U[]
  ? U[]
  : U;

export function add<A, B>(a: A, b: B) {
  return operate((l, r) => l + r, a, b);
}

export function subtract<A, B>(a: A, b: B) {
  return operate((l, r) => l - r, a, b);
}

export function multiply<A, B>(a: A, b: B) {
  return operate((l, r) => l * r, a, b);
}

export function divide<A, B>(a: A, b: B) {
  return operate((l, r) => l / r, a, b);
}

export function operate<A, B>(operation: Operator, a?: A, b?: B) {
  if (isNumber(a) && isNumber(b))
    return operation(a, b) as ListOrValue<number, A, B>;

  const al = Array.isArray(a) ? a : [a];
  const bl = Array.isArray(b) ? b : [b];

  const [first, second] = al.length >= bl.length ? [al, bl] : [bl, al];

  const sum = first.map((v, i) => operation(toNumber(v), toNumber(second[i])));

  return (sum.length <= 1 ? sum[0] : sum) as ListOrValue<number, A, B>;
}

function toNumber(v: unknown): number {
  return isNumber(v) ? v : 0;
}

function isNumber(v: unknown): v is number {
  return typeof v === 'number' && Number.isFinite(v) && !Number.isNaN(v);
}

// function createOperator(operator: Operator) {
//   return <A = unknown, B = unknown>(a: A, b: B) => operate(operator, a, b);
// }
