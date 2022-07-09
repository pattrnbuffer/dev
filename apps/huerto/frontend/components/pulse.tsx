import { createTimeout } from '@dev/tools';
import { useMountedRef } from '@dev/hooks';
import React, {
  CSSProperties,
  FC,
  useEffect,
  useMemo,
  useState,
  VFC,
} from 'react';

type StyleProps = { style?: CSSProperties | undefined };

export const Pulse: React.FC<{
  as: string | FC<StyleProps> | VFC<StyleProps>;
  ease?: 'ease' | 'ease-in' | 'ease-out';
  delay?: number;
  duration?: number;
  style?: React.CSSProperties;
}> = ({
  as: Container,
  ease = 'ease',
  duration = 200,
  delay = 0,
  style,
  children,
  ...props
}) => {
  const [opacity, setOpacity] = useState<string | number | undefined>(0);

  const mounted = useMountedRef();
  useEffect(() => {
    // initial effect state
    if (opacity === 0)
      return createTimeout(
        mounted.guard(() => setOpacity(() => style?.opacity ?? 1)),
        delay ?? 0,
      );

    // terminal effect state
    if (opacity === 1 || opacity === (style?.opacity ?? 1))
      return createTimeout(
        mounted.guard(() => setOpacity(undefined)),
        duration,
      );
  }, [opacity]);

  return (
    <Container
      {...props}
      style={{
        ...style,
        opacity: 0,
        transition: [style?.transition, `opacity ${ease} ${duration}ms`]
          .filter(Boolean)
          .join(','),
      }}
    />
  );
};
