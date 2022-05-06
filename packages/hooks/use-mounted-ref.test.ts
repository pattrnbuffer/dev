import { useEffect, useState } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { useMountedRef, MountedRef } from './use-mounted-ref';

describe('useMountedRef', () => {
  test('it reports as mounted', async () => {
    const { result, waitForNextUpdate } = renderMountedHook(
      (mounted, action) => {
        if (mounted()) action();
      },
    );
    // nothing has resolved
    expect(result.current.commits).toBe(0);
    await waitForNextUpdate();
    // the promise has resolved
    expect(result.current.commits).toBe(1);
  });

  test('it commits while mounted', async () => {
    const { result } = renderMountedHook((mounted, action) => {
      mounted.commit(action);
    });

    await act(async () => {
      result.current.set(3);
      result.current.set(7);
      result.current.set(9);
      result.current.set(11);
    });

    // only one promise has resolved
    expect(result.current.commits).toBe(2);
  });
});

const renderMountedHook = (
  callback: (ref: MountedRef, action: () => unknown) => unknown,
) =>
  renderHook(() => {
    const mounted = useMountedRef();
    const [commits, setCommits] = useState(0);
    const [value, setValue] = useState<Promise<number>>(Promise.resolve(0));

    useEffect(() => {
      value.then(() =>
        callback(mounted, () => setCommits(commits => commits + 1)),
      );
    }, [value]);

    return {
      commits,
      set: (value: number) => {
        setValue(new Promise(next => next(value)));
      },
    };
  });
