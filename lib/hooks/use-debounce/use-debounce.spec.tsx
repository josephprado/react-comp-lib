import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './use-debounce';

describe(useDebounce.name, () => {
  it('should update the value after the delay', () => {
    const initialValue = 'foo';
    const newValue = 'bar';
    const delay = 2000;

    vi.useFakeTimers();

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, delay),
      {
        initialProps: { value: initialValue },
      },
    );

    // Initially, the debounced value should be the initial value.
    expect(result.current).toEqual(initialValue);

    // Fast forward time to just before delay. The value should not update yet.
    rerender({ value: newValue });
    act(() => vi.advanceTimersByTime(delay - 1));
    expect(result.current).toEqual(initialValue);

    // Fast forward time again. The value should update.
    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toEqual(newValue);

    vi.clearAllTimers();
    vi.useRealTimers();
  });
});
