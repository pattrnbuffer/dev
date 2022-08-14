export function vectorFor(
  dimensions: number[],
  point: number[],
  region: number[] = [],
) {
  return dimensions.map((dim, i) => {
    const focus = region[i % region.length] ?? 0.5;
    return ((point[i] + focus) / dim - focus) * dim;
  });
}
