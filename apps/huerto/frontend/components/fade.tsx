import { createTimeout } from '@bffr/tools';
import { useMountedRef } from '@bffr/hooks';
import React, { CSSProperties, FC, useEffect, useState, VFC } from 'react';

type StyleProps = { style?: CSSProperties | undefined };

export const Fade: React.FC<{
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
  const [state, setState] = useState<CSSProperties | undefined>(() => ({
    ...style,
    opacity: 0,
    transition: [style?.transition, `opacity ${ease} ${duration}ms`]
      .filter(Boolean)
      .join(','),
  }));

  const mounted = useMountedRef();
  useEffect(() => {
    // initial effect state
    if (state?.opacity === 0)
      return createTimeout(
        mounted.guard(() =>
          setState(state => ({ ...state, opacity: style?.opacity ?? 1 })),
        ),
        delay ?? 0,
      );

    // terminal effect state
    if (state?.opacity === 1 || state?.opacity === style?.opacity)
      return createTimeout(
        mounted.guard(() => setState(undefined)),
        duration,
      );
  }, [state]);

  return <Container style={state ?? style} {...props} />;
};
