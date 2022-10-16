import { createContext, useContext, useMemo } from 'react';

const AudioContext = window?.AudioContext;
const AudioContextContext = createContext<AudioContext>(
  new AudioContext({ latencyHint: 'interactive', sampleRate: 48000 }),
);

export const AudioContextProvider = AudioContextContext.Provider;

/**
 * move to  @bffr/whooks … web
 * consider @bffr/uhooks … universal
 * or even  @bffr/nhooks … native
 */
export function useAudioContext(
  customContext?: AudioContextOptions | InstanceType<typeof AudioContext>,
) {
  const parentContext = useContext(AudioContextContext);

  const hasContext = customContext instanceof AudioContext;
  const hasProps =
    !hasContext &&
    customContext != null &&
    ('frequency' in customContext || 'sampleRate' in customContext);

  return useMemo<AudioContext>(
    () =>
      hasContext
        ? customContext
        : hasProps
        ? new AudioContext(customContext)
        : parentContext,
    // dependency list
    hasContext
      ? [customContext]
      : hasProps
      ? Object.values(customContext)
      : [parentContext],
  );
}
