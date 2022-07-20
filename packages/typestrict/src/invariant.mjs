/** @type {<T>(value: T, message: string) => T} */
export function invariant(value, message) {
  if (!value) throw `\n${message}\n`;
  else return value;
}
