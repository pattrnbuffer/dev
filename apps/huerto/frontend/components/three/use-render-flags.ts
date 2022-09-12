import { useEffect, useRef } from 'react';

export type RenderFlags = {
  mounted: boolean;
  rendered: boolean;
  unmounted: boolean;
};

export function useRenderFlags() {
  const ref = useRef<RenderFlags>({
    mounted: true,
    rendered: false,
    unmounted: false,
  });

  useEffect(() => {
    ref.current.rendered = true;

    return () => {
      ref.current.mounted = false;
      ref.current.unmounted = true;
    };
  });

  const clone = <T extends Record<string, any>>(
    target?: T,
  ): T & RenderFlags => {
    const keys = Object.keys(ref.current) as (keyof RenderFlags)[];

    return Object.assign(
      target ?? {},
      ...keys.map(key => ({
        get [key]() {
          return ref.current[key];
        },
      })),
    );
  };

  return clone({ clone });
}
