import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useWizard } from './use-wizard';

type Thing = {
  foo: string;
  bar: number;
  baz: boolean;
};

describe(useWizard.name, () => {
  it('should initialize values to an empty object', () => {
    const { result } = renderHook(() => useWizard<Thing>());
    expect(result.current.values).toEqual({});
  });

  it('should update the named value when setValue called', () => {
    const { result } = renderHook(() => useWizard<Thing>());
    expect(result.current.values).toEqual({});

    act(() => result.current.setValue('foo', 'bar'));
    expect(result.current.values).toEqual({ foo: 'bar' });
  });

  it('should initialize stepIndex to 0', () => {
    const { result } = renderHook(() => useWizard<Thing>());
    expect(result.current.stepIndex).toEqual(0);
  });

  it.each([[1], [2], [5], [10]])(
    'should increment stepIndex by one when nextStep called (n=%s)',
    (n: number) => {
      const { result } = renderHook(() => useWizard<Thing>());
      act(() => {
        for (let i = 0; i < n; i++) result.current.nextStep();
      });
      expect(result.current.stepIndex).toEqual(n);
    },
  );

  it.each([[1], [2], [5], [10]])(
    'should decrement stepIndex by one when prevStep called (currentStep=%s)',
    (currentStep: number) => {
      const { result } = renderHook(() => useWizard<Thing>());

      act(() => {
        for (let i = 0; i < currentStep; i++) result.current.nextStep();
      });
      expect(result.current.stepIndex).toEqual(currentStep);

      act(() => result.current.prevStep());
      expect(result.current.stepIndex).toEqual(currentStep - 1);
    },
  );

  it('should not decrement stepIndex below 0 when prevStep called', () => {
    const { result } = renderHook(() => useWizard<Thing>());
    expect(result.current.stepIndex).toEqual(0);

    act(() => result.current.prevStep());
    expect(result.current.stepIndex).toEqual(0);
  });

  it.each([[1], [2], [5], [10]])(
    'should set stepIndex to 0 when reset called (currentStep=%s)',
    (currentStep: number) => {
      const { result } = renderHook(() => useWizard<Thing>());

      act(() => {
        for (let i = 0; i < currentStep; i++) result.current.nextStep();
      });
      expect(result.current.stepIndex).toEqual(currentStep);

      act(() => result.current.reset());
      expect(result.current.stepIndex).toEqual(0);
    },
  );

  it('should clear values when reset is called', () => {
    const { result } = renderHook(() => useWizard<Thing>());

    act(() => result.current.setValue('foo', 'bar'));
    expect(result.current.values).toEqual({ foo: 'bar' });

    act(() => result.current.reset());
    expect(result.current.values).toEqual({});
  });
});
