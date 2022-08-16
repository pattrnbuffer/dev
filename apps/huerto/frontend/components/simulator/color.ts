import { sortBy } from 'lodash';

export function rgba([r = 127, g = 127, b = 127, a = 0.75]: number[]) {
  [r, g, b] = [r, g, b].map(c => Math.round(Math.max(0, c % 255)));
  a = Math.max(0, Math.min(a, 1));

  [r, g, b] = findColor([r, g, b]);

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function generateColor(
  colorways: (number | string)[][],
  position: number[],
  generator = (a: number, b: number) => a + b,
) {
  const color =
    colorways[Math.abs(position.reduce(generator, 0)) % colorways.length];

  return color.slice(0, 3) as number[];
}

function findColor([r, g, b]: number[]) {
  const [color] = sortBy(flatColors, ([cr, cg, cb]) =>
    [r - cr, g - cg, b - cb].reduce((a, b) => a + Math.abs(b), 0),
  );

  return color ?? [r, g, b];
}

export const tileColors = [
  [26, 188, 156, '#1abc9c', 'turquoise'],
  [46, 204, 113, '#2ecc71', 'emerland'],
  [22, 160, 133, '#16a085', 'green-sea'],
  [39, 174, 96, '#27ae60', 'nephritis'],
  [52, 152, 219, '#3498db', 'peter-river'],
  [236, 240, 241, '#ecf0f1', 'clouds'],
  [189, 195, 199, '#bdc3c7', 'silver'],
];

export const flatColors = [
  [26, 188, 156, '#1abc9c', 'turquoise'],
  [46, 204, 113, '#2ecc71', 'emerland'],
  [52, 152, 219, '#3498db', 'peter-river'],
  [155, 89, 182, '#9b59b6', 'amethyst'],
  [52, 73, 94, '#34495e', 'wet-asphalt'],
  [22, 160, 133, '#16a085', 'green-sea'],
  [39, 174, 96, '#27ae60', 'nephritis'],
  [41, 128, 185, '#2980b9', 'belize-hole'],
  [142, 68, 173, '#8e44ad', 'wisteria'],
  [44, 62, 80, '#2c3e50', 'midnight-blue'],
  [241, 196, 15, '#f1c40f', 'sun-flower'],
  [230, 126, 34, '#e67e22', 'carrot'],
  [231, 76, 60, '#e74c3c', 'alizarin'],
  [236, 240, 241, '#ecf0f1', 'clouds'],
  [149, 165, 166, '#95a5a6', 'concrete'],
  [243, 156, 18, '#f39c12', 'orange'],
  [211, 84, 0, '#d35400', 'pumpkin'],
  [192, 57, 43, '#c0392b', 'pomegranate'],
  [189, 195, 199, '#bdc3c7', 'silver'],
  [127, 140, 141, '#7f8c8d', 'asbestos'],
] as const;
