import { useCallback, useEffect, useState } from 'react';

/**
 * A valid sort key for type T.
 */
export type SortKey<T> = keyof T;

/**
 * The direction of the currently sorted column.
 */
export type SortDir = 'up' | 'down';

/**
 * A function that determines the relative sort order of its two arguments. The
 * function should return the following values:
 * ```
 * if (a < b) return x; // x < 0
 * if (a > b) return y; // y > 0
 * if (a == b) return 0;
 * ```
 */
export type CompareFn<V> = (a: V, b: V) => number;

/**
 * An object assigning an optional {@link CompareFn} to each property of `T`.
 *
 * @example
 * ```
 * type Person = {
 *   name: {
 *     first: string;
 *     last: string;
 *   };
 *   age: number;
 *   address: {
 *     street: string;
 *     city: string;
 *     state: string;
 *     zip: number;
 *   }
 * }
 *
 * const compareFns: CompareFns<Person> = {
 *   name: (a, b) => {
 *     if (a.last < b.last) return -1;
 *     if (a.last > b.last) return 1;
 *     return 0;
 *   },
 *   address: (a, b) => a.zip - b.zip
 * }
 * ```
 */
export type CompareFns<T> = {
  [K in SortKey<T>]?: CompareFn<T[K]>;
};

/**
 * Sorts the data by the given key. When calling this function with a
 * non-null / defined value for sortKey, the sort direction is automatically
 * set based on the current state. The initial call of this function for a
 * given sortKey always uses the `up` direction. Subsequent calls with the
 * same sortKey follow the pattern described in the example below. Calling
 * this function with a null / undefined value for sortKey will return the
 * data to its original unsorted state.
 *
 * @example Behavior when calling sortFn() 3 times with the same key:
 * sortFn(x) -> Sorts the table by x in the up direction.
 * sortFn(x) -> Sorts the table by x in the down direction.
 * sortFn(x) -> Returns the table to its original unsorted state.
 *
 * @param sortKey The sort key used for ordering.
 */
export type SortFn<T> = (sortKey?: SortKey<T>) => void;

/**
 * Props for the {@link useSorting} hook.
 */
export interface UseSortingProps<T> {
  data: T[];
  defaultSortKey?: SortKey<T>;
  defaultSortDir?: SortDir;
  compareFns?: CompareFns<T>;
}

/**
 * The return type of the {@link useSorting} hook.
 */
export type SortingUtils<T> = [
  SortKey<T> | undefined,
  SortDir | undefined,
  SortFn<T>,
  T[],
];

/**
 * Provides utilities for sorting data.
 *
 * @param props {@link UseSortingProps}
 * @returns A {@link SortingUtils}.
 */
export function useSorting<T>({
  data,
  defaultSortKey,
  defaultSortDir,
  compareFns,
}: UseSortingProps<T>): SortingUtils<T> {
  const compareFn = useCallback(
    (key: SortKey<T>, dir: SortDir) => (a: T, b: T) => {
      const flip = dir === 'down' ? -1 : 1;
      const sortA = a[key];
      const sortB = b[key];
      const compFn = compareFns?.[key];

      if (compFn) return compFn(sortA, sortB) * flip;
      if (sortA < sortB) return -1 * flip;
      if (sortA > sortB) return 1 * flip;
      return 0;
    },
    [compareFns],
  );

  const [sort, setSort] = useState<{
    key?: SortKey<T>;
    dir?: SortDir;
    sorted: T[];
  }>(() => ({
    key: defaultSortKey,
    dir: defaultSortDir,
    sorted:
      defaultSortKey != null && defaultSortDir != null
        ? structuredClone(data).sort(compareFn(defaultSortKey, defaultSortDir))
        : structuredClone(data),
  }));

  const sortFn: SortFn<T> = useCallback(
    (sortKey?: SortKey<T>) => {
      setSort(({ key, dir, sorted }) => {
        if (sortKey == null || (sortKey === key && dir === 'down')) {
          return {
            sorted: structuredClone(data),
          };
        } else if (sortKey === key && dir === 'up') {
          return {
            key: sortKey,
            dir: 'down',
            sorted: sorted.sort(compareFn(sortKey, 'down')),
          };
        } else {
          return {
            key: sortKey,
            dir: 'up',
            sorted: sorted.sort(compareFn(sortKey, 'up')),
          };
        }
      });
    },
    [compareFn, data],
  );

  useEffect(() => {
    setSort(({ key, dir }) => ({
      key,
      dir,
      sorted:
        key != null && dir != null
          ? structuredClone(data).sort(compareFn(key, dir))
          : structuredClone(data),
    }));
  }, [compareFn, data]);

  return [sort.key, sort.dir, sortFn, sort.sorted];
}
