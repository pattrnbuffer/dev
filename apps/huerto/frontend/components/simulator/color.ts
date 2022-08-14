export function rgba([r = 127, g = 127, b = 127, a = 0.75]: number[]) {
  [r, g, b] = [r, g, b].map(c => Math.round(Math.max(0, c % 255)));
  a = Math.max(0, Math.min(a, 1));

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
