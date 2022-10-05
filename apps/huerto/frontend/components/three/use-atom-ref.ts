import { atom, WritableAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useEffect, useMemo, useRef } from 'react';

export function useAtomRef<Value, Update, Result extends void | Promise<void>>(
  stateAtom: WritableAtom<Value, Update, Result>,
) {
  const ref = useRef<Update>();
  const pipedAtom = useMemo(
    () =>
      atom(
        get => get(stateAtom),
        (get, set, newValue) => {
          const nextValue: Update =
            typeof newValue === 'function'
              ? newValue(get(stateAtom))
              : newValue;

          ref.current = nextValue as unknown as Update;

          set(stateAtom, nextValue);
        },
      ),
    [],
  );
  // blerg, this is gross
  const setValue = useUpdateAtom(pipedAtom);
  useEffect(() => {
    setValue(v => v as unknown as Update);
  }, [setValue]);

  return [ref, pipedAtom] as const;
}
