import { useEffect, useMemo } from 'react';
import { useAudioContext } from './use-audio-context';
import { useEffectSets } from './use-effect-sets';

type AudioContextOscillatorProps = {
  frequency?: number;
  type?: OscillatorType;
};

const baseProps: Required<AudioContextOscillatorProps> = {
  frequency: 440,
  type: 'sine',
} as const;

export function useAudioContextOscillator(props: AudioContextOscillatorProps) {
  const { frequency, type } = { ...baseProps, ...props };

  // create web audio api context
  const ctx = useAudioContext();

  // initialize oscilator
  const oscillator = useMemo(() => ctx.createOscillator(), [ctx]);

  useEffect(() => {}, [oscillator]);

  useEffectSets(
    [
      () => oscillator,
      () => {
        oscillator.start();
        return () => oscillator.stop();
      },
    ],
    [
      () => frequency,
      () => {
        oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
      },
    ],
    [
      () => type,
      () => {
        oscillator.type = type;
      },
    ],
  );

  return [oscillator];
}

export { useAudioContextOscillator as useOscillator };
