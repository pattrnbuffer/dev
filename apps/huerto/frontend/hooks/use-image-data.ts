import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

type XY = [number, number];
type RGBA = [number, number, number, number];
type Converter = (xy: XY) => RGBA;

export function useImageData(
  image?: HTMLImageElement | undefined,
  xy?: XY,
): [RGBA, Converter] {
  const [x, y] = xy ?? [0, 0];

  const canvas = useMemo(() => document.createElement('canvas'), [image]);
  useLayoutEffect(() => {
    if (image && canvas) {
      const { width, height } = image.getBoundingClientRect();

      canvas.width = width;
      canvas.height = height;
      canvas
        .getContext('2d')
        ?.drawImage(image, 0, 0, canvas.width, canvas.height);
    }

    return () => canvas?.remove();
  }, [canvas]);

  return [
    useMemo(() => canvasPixelFor(canvas, [x, y]), [x, y, canvas]),
    useCallback(
      (xy: XY) => {
        return canvas ? canvasPixelFor(canvas, xy) : [255, 255, 255, 0];
      },
      [canvas],
    ),
  ];
}

const canvasPixelFor = (canvas: HTMLCanvasElement | undefined, [x, y]: XY) => {
  const lx = x * (canvas?.width ?? 0);
  const ly = (1 - y) * (canvas?.height ?? 0);

  return <RGBA>(
    (canvas?.getContext('2d')?.getImageData(lx, ly, 1, 1).data ?? [0, 0, 0, 50])
  );
};
