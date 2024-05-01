import { beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { Filter, useFiltering } from './use-filtering';

const [FILTERS, SET_FILTER, FILTERED_DATA, CLEAR_FILTER] = [
  0, 1, 2, 3,
] as const;

interface T {
  id: number;
  a: string;
  0: number;
  '': string;
  z: { x: number; y: number };
}

interface F {
  id: number;
  a: string;
  z: { x: number };
}

describe(useFiltering.name, () => {
  let data: T[] = [];

  beforeEach(() => {
    data = [
      { id: 1, a: 'A', 0: 3, '': 'a', z: { x: 1, y: 2 } },
      { id: 2, a: 'B', 0: 1, '': 'b', z: { x: 2, y: 3 } },
      { id: 3, a: 'C', 0: 2, '': 'c', z: { x: 3, y: 1 } },
    ];
  });

  it('should set filteredData as expected', () => {
    const { result } = renderHook(() => useFiltering<T, F>({ data }));
    expect(result.current[FILTERED_DATA]).toEqual(data);
  });

  it('should set the named filter when setFilter called', () => {
    const filter: Filter<T, F['id']> = {
      label: 'id',
      active: true,
      state: 1,
      clearedState: 0,
    };
    const { result } = renderHook(() => useFiltering<T, F>({ data }));

    act(() => result.current[SET_FILTER]({ name: 'id', ...filter }));
    expect(result.current[FILTERS]).toEqual({ id: filter });
  });

  it('should filter the data when setFilter called and the filter is active (1 filter)', () => {
    data = [
      { id: 1, a: 'A', 0: 3, '': 'a', z: { x: 1, y: 2 } },
      { id: 2, a: 'B', 0: 1, '': 'b', z: { x: 2, y: 3 } },
      { id: 3, a: 'C', 0: 2, '': 'c', z: { x: 3, y: 1 } },
      { id: 4, a: 'C', 0: 2, '': 'c', z: { x: 3, y: 1 } },
      { id: 5, a: 'C', 0: 2, '': 'c', z: { x: 3, y: 1 } },
    ];
    const filter: Filter<T, F['id']> = {
      label: 'id',
      active: true,
      state: 1,
      clearedState: 0,
      fn: (item, state) => item.id > state,
    };
    const { result } = renderHook(() => useFiltering<T, F>({ data }));

    act(() => result.current[SET_FILTER]({ name: 'id', ...filter }));
    const [_, ...expected] = data;
    expect(result.current[FILTERED_DATA]).toEqual(expected);
  });

  it('should filter the data when setFilter called and the filter is active (2 filters)', () => {
    data = [
      { id: 1, a: 'A', 0: 3, '': 'a', z: { x: 1, y: 2 } },
      { id: 2, a: 'B', 0: 1, '': 'b', z: { x: 2, y: 3 } },
      { id: 3, a: 'C', 0: 2, '': 'c', z: { x: 3, y: 1 } },
      { id: 4, a: 'C', 0: 2, '': 'c', z: { x: 3, y: 1 } },
      { id: 5, a: 'C', 0: 2, '': 'c', z: { x: 3, y: 1 } },
      { id: 6, a: 'D', 0: 2, '': 'c', z: { x: 3, y: 1 } },
      { id: 7, a: 'D', 0: 2, '': 'c', z: { x: 3, y: 1 } },
    ];
    const aFilter: Filter<T, F['a']> = {
      label: 'a',
      active: true,
      state: 'C',
      clearedState: '',
      fn: (item, state) => item.a !== state,
    };
    const zFilter: Filter<T, F['z']> = {
      label: 'z',
      active: true,
      state: { x: 1 },
      clearedState: { x: 0 },
      fn: (item, state) => item.z.x > state.x,
    };
    const { result } = renderHook(() => useFiltering<T, F>({ data }));

    act(() => {
      result.current[SET_FILTER]({ name: 'a', ...aFilter });
      result.current[SET_FILTER]({ name: 'z', ...zFilter });
    });
    const expected = [data[1], data[5], data[6]];
    expect(result.current[FILTERED_DATA]).toEqual(expected);
  });

  it('should not filter the data when setFilter called and the filter is inactive', () => {
    const filter: Filter<T, F['id']> = {
      label: 'id',
      active: false,
      state: 1,
      clearedState: 0,
      fn: (item, state) => item.id === state,
    };
    const { result } = renderHook(() => useFiltering<T, F>({ data }));

    act(() => result.current[SET_FILTER]({ name: 'id', ...filter }));
    expect(result.current[FILTERED_DATA]).toEqual(data);
  });

  it('should un-filter the data when filter is set to inactive', () => {
    const filter: Filter<T, F['id']> = {
      label: 'id',
      active: true,
      state: 1,
      clearedState: 0,
      fn: (item, state) => item.id === state,
    };
    const { result } = renderHook(() => useFiltering<T, F>({ data }));

    act(() => result.current[SET_FILTER]({ name: 'id', ...filter }));
    expect(result.current[FILTERED_DATA]).toEqual(
      data.filter(({ id }) => id === filter.state),
    );

    act(() =>
      result.current[SET_FILTER]({ name: 'id', state: 1, active: false }),
    );
    expect(result.current[FILTERED_DATA]).toEqual(data);
  });

  it.each([[undefined], [true]])(
    'should clear the named filter when clearFilter called (inactivate=%s)',
    (inactivate?: boolean) => {
      const idFilter: Filter<T, F['id']> = {
        label: 'id',
        active: true,
        state: 1,
        clearedState: 0,
      };
      const aFilter: Filter<T, F['a']> = {
        label: 'a',
        active: true,
        state: 'aa',
        clearedState: '',
      };
      const { result } = renderHook(() => useFiltering<T, F>({ data }));

      act(() => {
        result.current[SET_FILTER]({ name: 'id', ...idFilter });
        result.current[SET_FILTER]({ name: 'a', ...aFilter });
      });
      expect(result.current[FILTERS]).toEqual({ id: idFilter, a: aFilter });

      act(() => result.current[CLEAR_FILTER]('id', inactivate));
      const { id, a } = result.current[FILTERS];

      expect(id?.active).toEqual(inactivate ? false : idFilter.active);
      expect(id?.state).toEqual(idFilter.clearedState);
      expect(a?.active).toEqual(aFilter.active);
      expect(a?.state).toEqual(aFilter.state);
    },
  );
});
