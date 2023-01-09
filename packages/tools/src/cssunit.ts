type CSSInput = REM | PX;
type REM = `${number}rem` | `${number} rem`;
type PX = `${number}px` | `${number} px`;
type CSSUnitType = 'rem' | 'px';

const digitsRx = /([^.0-9])/g;
const unitRx = /[^pxrem]/g;

export function CSSUnit<T extends CSSInput>(input: T, base = 16) {
  const [value, type] = [
    Number(input.replace(digitsRx, '')),
    input.toLowerCase().replace(unitRx, ''),
  ];

  return createCSSUnit(value, type as CSSUnitType, base);
}

export function createCSSUnit(value: number, type: CSSUnitType, base = 16) {
  const [rem, px] =
    type === 'rem' ? [value, value * base] : [value / base, value];

  return Object.assign(
    Number(value),
    { value, type, base, rem, px },
    { valueOf: () => value, toString: () => `${value}${type}` },
  );
}
