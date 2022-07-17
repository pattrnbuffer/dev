export function invariant(value, message) {
  if (!value) throw `\n${message}\n`;
  else return value;
}
