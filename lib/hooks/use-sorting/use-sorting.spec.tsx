import { beforeEach, describe, expect, it } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import {
  CompareFn,
  SortDir,
  SortKey,
  UseSortingProps,
  useSorting,
} from './use-sorting';

const [SORT_KEY, SORT_DIR, SORT_FN, SORTED_DATA] = [0, 1, 2, 3] as const;

interface T {
  id: number;
  a: string;
  b: string;
  0: number;
  '': number;
  z: { x: number; y: number };
}

// See https://stackoverflow.com/questions/65676728/useeffect-infinite-loop-occurs-only-while-testing-not-otherwise-despite-using
function renderUseSortingHook(props: UseSortingProps<T>) {
  return renderHook(() => useSorting<T>(props));
}

describe(useSorting.name, () => {
  let rows: T[] = [];

  beforeEach(() => {
    rows = [
      { id: 1, a: 'A', b: 'B', 0: 3, '': 3, z: { x: 1, y: 2 } },
      { id: 2, a: 'B', b: 'C', 0: 1, '': 2, z: { x: 2, y: 3 } },
      { id: 3, a: 'C', b: 'A', 0: 2, '': 1, z: { x: 3, y: 1 } },
    ];
  });

  it.each([
    ['a' as SortKey<T>, 'up' as SortDir, [1, 2, 3]],
    ['a' as SortKey<T>, 'down' as SortDir, [3, 2, 1]],
    ['b' as SortKey<T>, 'up' as SortDir, [3, 1, 2]],
    ['b' as SortKey<T>, 'down' as SortDir, [2, 1, 3]],
    [0 as SortKey<T>, 'up' as SortDir, [2, 3, 1]],
    [0 as SortKey<T>, 'down' as SortDir, [1, 3, 2]],
    ['' as SortKey<T>, 'up' as SortDir, [3, 2, 1]],
    ['' as SortKey<T>, 'down' as SortDir, [1, 2, 3]],
    ['z' as SortKey<T>, 'up' as SortDir, [1, 2, 3]],
    ['z' as SortKey<T>, 'down' as SortDir, [3, 2, 1]],
  ])(
    'should sort by the default sortKey and sortDir as expected (key=%s, dir=%s)',
    (key: SortKey<T>, dir: SortDir, expected: number[]) => {
      const { result } = renderUseSortingHook({
        data: rows,
        defaultSortKey: key,
        defaultSortDir: dir,
        compareFns: { z: (a, b) => a.x - b.x },
      });
      expect(result.current[SORT_KEY]).toEqual(key);
      expect(result.current[SORT_DIR]).toEqual(dir);
      expect(result.current[SORTED_DATA].map(({ id }) => id)).toEqual(expected);
    },
  );

  it.each([
    ['a' as SortKey<T>, [1, 2, 3]],
    ['b' as SortKey<T>, [3, 1, 2]],
    [0 as SortKey<T>, [2, 3, 1]],
    ['' as SortKey<T>, [3, 2, 1]],
    ['z' as SortKey<T>, [1, 2, 3], (a: T['z'], b: T['z']) => a.x - b.x],
    ['z' as SortKey<T>, [3, 1, 2], (a: T['z'], b: T['z']) => a.y - b.y],
  ])(
    'should sort the data as expected',
    (key: SortKey<T>, expected: number[], zCompareFn?: CompareFn<T['z']>) => {
      const { result } = renderUseSortingHook({
        data: rows,
        compareFns: { z: zCompareFn },
      });
      act(() => result.current[SORT_FN](key));
      expect(result.current[SORTED_DATA].map(({ id }) => id)).toEqual(expected);
    },
  );

  it.each([
    ['a' as SortKey<T>, 1, [1, 2, 3]],
    ['a' as SortKey<T>, 2, [3, 2, 1]],
    ['a' as SortKey<T>, 3, [1, 2, 3]], // default state of rows

    ['b' as SortKey<T>, 1, [3, 1, 2]],
    ['b' as SortKey<T>, 2, [2, 1, 3]],
    ['b' as SortKey<T>, 3, [1, 2, 3]], // default state of rows

    [0 as SortKey<T>, 1, [2, 3, 1]],
    [0 as SortKey<T>, 2, [1, 3, 2]],
    [0 as SortKey<T>, 3, [1, 2, 3]], // default state of rows

    ['' as SortKey<T>, 1, [3, 2, 1]],
    ['' as SortKey<T>, 2, [1, 2, 3]],
    ['' as SortKey<T>, 3, [1, 2, 3]], // default state of rows

    ['z' as SortKey<T>, 1, [3, 1, 2]],
    ['z' as SortKey<T>, 2, [2, 1, 3]],
    ['z' as SortKey<T>, 3, [1, 2, 3]], // default state of rows
  ])(
    'should sort in the order: up > down > default when sortFn() called 3 times on same key (key=%s, clicks=%s)',
    (key: SortKey<T>, clicks: number, expected: number[]) => {
      const { result } = renderUseSortingHook({
        data: rows,
        compareFns: { z: (a, b) => a.y - b.y },
      });
      act(() => {
        for (let i = 0; i < clicks; i++) result.current[SORT_FN](key);
      });
      expect(result.current[SORTED_DATA].map(({ id }) => id)).toEqual(expected);
    },
  );
});
