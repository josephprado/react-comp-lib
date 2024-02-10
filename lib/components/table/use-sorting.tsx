import { useState } from 'react';

/**
 * A valid sort key for type T.
 */
export type SortKey<T> = keyof T;

/**
 * The direction of the currently sorted column.
 */
export type SortDir = 'up' | 'down';

/**
 * Defines the sort value used for sorting a value.
 */
export interface SortValue<V> {
  value: V;
  sortValue: any;
}

/**
 * A type of object capable of being sorted. Convert any property that cannot
 * be sorted in its raw form to a {@link SortValue} as per the example below.
 *
 * @example
 * The following data type has the property `name` as an object. To ensure that
 * this property is sorted by `lastName`, convert it as follows:
 *
 * before: {
 *  age: 8,
 *  name: { firstName: 'Joe', lastName: 'Schmoe' }
 * }
 * after: {
 *  age: 8,
 *  name: {
 *    value: { firstName: 'Joe', lastName: 'Schmoe' },
 *    sortValue: 'Schmoe'
 *  }
 * }
 */
export type Sortable<T> = {
  [K in SortKey<T>]: T[K] | SortValue<T[K]>;
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
 * The return type of the {@link useSorting} hook.
 */
export type SortingUtils<T> = [
  SortKey<T> | undefined,
  SortDir | undefined,
  SortFn<T>,
  T[],
];

/**
 * Returns a compare function used as an argument for the Arrays.sort function.
 *
 * @param key The sort key used for ordering.
 * @param dir The direction of the sort.
 * @returns A compare function.
 */
function compareFn<T>(key: SortKey<T>, dir: SortDir) {
  return (a: Sortable<T>, b: Sortable<T>) => {
    const flip = dir === 'down' ? -1 : 1;

    const sortA = (a[key] as SortValue<T[SortKey<T>]>)?.sortValue ?? a[key];
    const sortB = (b[key] as SortValue<T[SortKey<T>]>)?.sortValue ?? b[key];

    if (sortA < sortB) return -1 * flip;
    if (sortA > sortB) return 1 * flip;
    return 0;
  };
}

/**
 * Provides utilities for sorting data. The rows are sorted based on the value
 * at `rows[i][sortKey]`, unless a `sortValue` property is present on that
 * value (`rows[i][sortKey].sortValue`), in which case the row is sorted based
 * on that sort value instead.
 *
 * @param data The data to sort.
 * @param defaultSortKey The initial sort key used for ordering.
 * @param defaultSortDir The initial direction of the sort.
 * @returns A {@link SortingUtils}.
 */
export function useSorting<T>(
  data: Sortable<T>[],
  defaultSortKey?: SortKey<T>,
  defaultSortDir?: SortDir,
): SortingUtils<T> {
  const [sort, setSort] = useState<{
    key?: SortKey<T>;
    dir?: SortDir;
    sorted: Sortable<T>[];
  }>({
    key: defaultSortKey,
    dir: defaultSortDir,
    sorted:
      defaultSortKey && defaultSortDir
        ? structuredClone(data).sort(compareFn(defaultSortKey, defaultSortDir))
        : structuredClone(data),
  });

  const sortFn: SortFn<T> = (sortKey?: SortKey<T>) => {
    setSort(() => {
      const { key, dir, sorted } = sort;

      if (!sortKey || (sortKey === key && dir === 'down')) {
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
  };

  // Transform data from Sortable<T>[] to T[]
  const sorted: T[] = sort.sorted.map((item) => {
    const t = {} as T;

    Object.entries(item).forEach(([k, v]) => {
      t[k as SortKey<T>] =
        typeof v === 'object' && 'value' in (v as SortValue<T[SortKey<T>]>)
          ? (v as SortValue<T[SortKey<T>]>).value
          : (v as T[SortKey<T>]);
    });

    return t;
  });

  return [sort.key, sort.dir, sortFn, sorted];
}
