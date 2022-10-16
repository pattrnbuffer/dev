import { MutableRefObject, RefCallback } from 'react';

export function assignRef<T>(
  ref?: RefCallback<T> | MutableRefObject<T> | null,
  value?: T,
) {
  if (ref == null) return;
  else if (typeof ref === 'function') ref(value!);
  else ref.current = value!;
}
