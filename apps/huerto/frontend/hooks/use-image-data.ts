import { useCallback, useLayoutEffect, useMemo, useRef } from 'react';

export type XY = [number, number];
export type RGBA = [number, number, number, number];
export type RGBAFor = (xy: XY) => RGBA;

const fallback = {
  // TODO: choose a pleasant default
  xy: [0.5, 0.5] as XY,
  // Magic numbers to scale the image down for correct sampling?
  sxy: [0.8, 0.8] as XY,
  rgba: [255, 255, 255, 0] as RGBA,
};

export function useImageData(
  image: HTMLImageElement | undefined,
  xy?: XY,
  // TODO: this is a convienence, remove it
  sxy?: XY,
  // used to verify source content is rendered properly
  target?: HTMLCanvasElement,
): [RGBA, RGBAFor] {
  const [x, y] =
    !xy?.length || xy?.some?.(Number.isNaN)
      ? fallback.xy
      : xy.map(v => Math.max(0, Math.min(v, 1)));

  const [SX, SY] = !sxy?.length ? fallback.sxy : sxy;

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
        return canvas ? canvasPixelFor(canvas, xy) : fallback.rgba;
      },
      [canvas],
    ),
  ];
}

const canvasPixelFor = (canvas: HTMLCanvasElement | undefined, [x, y]: XY) => {
  const lx = x * (canvas?.width ?? 0);
  const ly = (1 - y) * (canvas?.height ?? 0);
  const pixel = canvas
    ?.getContext('2d')
    ?.getImageData(lx * 0.8, ly * 0.8, 1, 1).data;

  return <RGBA>(pixel ?? fallback.rgba);
};
