type CSSInput = REM | PX;
type REM = `${number}rem` | `${number} rem`;
type PX = `${number}px` | `${number} px`;

export function CSSUnit<T extends CSSInput>(input: T, base: number = 16) {
  const [value, type] = [
    Number(input.replace(/([^.0-9])/g, '')),
    input.replace(/[^pxrem]/g, ''),
  ];

  const [rem, px] =
    type === 'rem' ? [value, value * base] : [value / base, value];

  return Object.assign(
    Number(value),
    { value, type, base, rem, px },
    { valueOf: () => value, toString: () => `${value}${type}` },
  );
}
