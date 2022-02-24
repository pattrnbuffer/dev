import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

export type XY = [number, number];
export type RGBA = [number, number, number, number];
export type RGBAFor = (xy: XY) => RGBA;

// Magic numbers to scale the image down for accuracy?
const [SX, SY] = [0.8, 0.8];
export function useImageData(
  image: HTMLImageElement | undefined,
  xy?: XY,
  // to verify source content is rendered properly
  target?: HTMLCanvasElement,
): [RGBA, RGBAFor] {
  const [x, y] = (xy ?? [0, 0]).map((v = 0) => Math.max(0, Math.min(v, 1)));

  const canvas = useMemo(
    () => target ?? document.createElement('canvas'),
    [image, target],
  );

  useLayoutEffect(() => {
    if (image && canvas) {
      const { width, height } = image.getBoundingClientRect();

      canvas.width = width;
      canvas.height = height;
    }
  }, [image]);

  useLayoutEffect(() => {
    if (image && canvas) {
      const { width, height } = image.getBoundingClientRect();

      canvas.width = width;
      canvas.height = height;
      canvas
        .getContext('2d')
        ?.drawImage(image, 0, 0, SX * canvas.width, SY * canvas.height);
    }

    return () => {
      target === canvas ? undefined : canvas?.remove();
    };
  }, [canvas]);

  return [
    useMemo(() => canvasPixelFor(canvas, [x, y]), [canvas, x, y]),
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
    (canvas?.getContext('2d')?.getImageData(lx * 0.8, ly * 0.8, 1, 1).data ?? [
      0, 0, 0, 0,
    ])
  );
};
