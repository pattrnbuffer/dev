export function bless<T>(input: unknown | T): input is T {
  return Boolean(input);
}

export function blessMany<T>(input: unknown | T[]): input is T[] {
  return Boolean(input);
}

export function cast<T>(input: unknown | T) {
  return bless(input) ? input : undefined;
}

export function castMany<T>(input: unknown | T[]) {
  return blessMany(input) ? input : undefined;
}
