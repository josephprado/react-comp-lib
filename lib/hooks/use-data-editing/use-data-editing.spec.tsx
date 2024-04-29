import { describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDataEditing } from './use-data-editing';

type Thing = {
  foo: string;
  bar: number;
  baz: boolean;
};

describe(useDataEditing.name, () => {
  it('should default to non-editing state', () => {
    const { result } = renderHook(() => useDataEditing<Thing>());
    expect(result.current.editing).toEqual(false);
  });

  it('should set editing to true when openEditMode called', () => {
    const { result } = renderHook(() => useDataEditing<Thing>());
    act(() => result.current.openEditMode());
    expect(result.current.editing).toEqual(true);
  });

  it('should initialize updates with initUpdates when openEditMode called', () => {
    const initUpdates: Partial<Thing> = {
      foo: 'bar',
      bar: 1,
      baz: true,
    };

    const { result } = renderHook(() => useDataEditing<Thing>());

    act(() => result.current.openEditMode(initUpdates));
    expect(result.current.updates).toEqual(initUpdates);
  });

  it('should set editing to false when cancelEditMode called', () => {
    const { result } = renderHook(() => useDataEditing<Thing>());

    act(() => result.current.openEditMode());
    expect(result.current.editing).toEqual(true);

    act(() => result.current.cancelEditMode());
    expect(result.current.editing).toEqual(false);
  });

  it('should clear updates when cancelEditMode called', () => {
    const initUpdates: Partial<Thing> = {
      foo: 'bar',
      bar: 1,
      baz: true,
    };

    const { result } = renderHook(() => useDataEditing<Thing>());

    act(() => result.current.openEditMode(initUpdates));
    expect(result.current.updates).toEqual(initUpdates);

    act(() => result.current.cancelEditMode());
    expect(result.current.updates).toEqual({});
  });

  it('should update the named value when updateValue called', () => {
    const initUpdates: Partial<Thing> = {
      foo: 'bar',
      bar: 1,
      baz: true,
    };

    const { result } = renderHook(() => useDataEditing<Thing>());

    act(() => result.current.openEditMode(initUpdates));
    expect(result.current.updates).toEqual(initUpdates);

    act(() => result.current.updateValue('baz', false));
    expect(result.current.updates).toEqual({ ...initUpdates, baz: false });
  });
});
