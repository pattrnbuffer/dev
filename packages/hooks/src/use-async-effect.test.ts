import { useState } from 'react';
import { act, renderHook } from '@testing-library/react-hooks';
import { useAsyncEffect } from './use-async-effect';

const renderAsyncEffectHook = (_?: Promise<unknown>) =>
  renderHook(() => {
    const [state, setState] = useState(false);
    useAsyncEffect(async mounted => {
      await _;

      if (mounted()) setState(true);
    }, []);

    return { state };
  });

describe('useAsyncEffect', () => {
  test('it resolves like a good hook should', async () => {
    const { result, waitForNextUpdate } = renderAsyncEffectHook();

    await waitForNextUpdate();
    expect(result.current.state).toBe(true);
  });

  test("it doesn't always resolve, and that's ok", async () => {
    const { result } = renderAsyncEffectHook(new Promise(() => {}));
    await act(async () => {});
    expect(result.current.state).toBe(false);
  });
});
