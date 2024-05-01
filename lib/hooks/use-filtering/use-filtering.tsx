import { useCallback, useMemo, useState } from 'react';

/**
 * Properties of a filter.
 */
export type Filter<T, S> = {
  /**
   * The display name of the filter.
   */
  label: string;

  /**
   * If true, the filter function `fn` will be applied to the data. Otherwise,
   * it will be ignored.
   */
  active: boolean;

  /**
   * The present state of the filter.
   */
  state: S;

  /**
   * The cleared/default state of the filter.
   */
  clearedState: S;

  /**
   * A function that determines if the given item passes the filter in its
   * present state.
   *
   * @param item The item to pass through the filter.
   * @param state The present state of the filter.
   * @returns True if the item passes the filter, or false otherwise.
   */
  fn?: (item: T, state: S) => boolean;
};

/**
 * An object containing named {@link Filter}s.
 */
export type Filters<T, F> = {
  [N in keyof F]?: Filter<T, F[N]>;
};

/**
 * Props for the {@link SetFilter} function.
 */
export type SetFilterProps<T, F, N extends keyof F> = {
  name: N;
} & Pick<Filter<T, F[N]>, 'state'> &
  Partial<Omit<Filter<T, F[N]>, 'state'>>;

/**
 * A function that sets the named filter in the filters object.
 */
export type SetFilter<T, F> = <N extends keyof F>(
  filter: SetFilterProps<T, F, N>,
) => void;

/**
 * A function that sets the named filter to its cleared state. Note that a
 * "clear" filter is different from an "inactive" filter. The former is a
 * filter whose state is reset to a default value. The latter is a filter
 * which is not currently being used to filter the data. An inactive filter
 * may have a state different from the cleared state.
 */
export type ClearFilter<F> = <N extends keyof F>(
  name: N,
  inactivate?: boolean,
) => void;

/**
 * Props for the {@link useFiltering} hook.
 */
export interface UseFilteringProps<T> {
  /**
   * The data to be filtered.
   */
  data: T[];
}

/**
 * The return type of the {@link useFiltering} hook.
 */
export type FilteringUtils<T, F> = [
  Filters<T, F>,
  SetFilter<T, F>,
  T[],
  ClearFilter<F>,
];

/**
 * Provides utilities for filtering data.
 *
 * @param props {@link UseFilteringProps}
 * @returns A {@link FilteringUtils}.
 */
export function useFiltering<T, F>({
  data,
}: UseFilteringProps<T>): FilteringUtils<T, F> {
  const [filters, setFilters] = useState<Filters<T, F>>({});

  const setFilter: SetFilter<T, F> = useCallback(
    <N extends keyof F>(filter: SetFilterProps<T, F, N>): void => {
      setFilters((prev) => {
        const { name, ...rest } = filter;
        return { ...prev, [name]: { ...prev[name], ...rest } };
      });
    },
    [],
  );

  const filteredData: T[] = useMemo(() => {
    return structuredClone(data).filter(
      (item) =>
        /*
          Find at least one filter where the item fails. If any fail, the item
          should be filtered out.
        */
        !(Object.keys(filters) as Array<keyof F>)
          .filter((name) => filters[name]?.active && filters[name]?.fn)
          .some((name) => {
            const { fn, state } = filters[name]!;
            return !fn!(item, state);
          }),
    );
  }, [filters, data]);

  const clearFilter: ClearFilter<F> = useCallback(
    <N extends keyof F>(name: N, inactivate = false): void => {
      setFilters((prev) => {
        const { [name]: filterToClear } = prev;

        if (!filterToClear) {
          throw new Error(
            `The ${name.toString()} filter has not been initialized. Call setFilter to initialize the filter before clearing it.`,
          );
        }

        const { clearedState, state, active } = filterToClear;

        if (typeof clearedState !== typeof state) {
          throw new Error(
            `The ${name.toString()} filter does not have a valid clearedState. Initialize the filter with a valid clearedState before clearing it.`,
          );
        }

        return {
          ...prev,
          [name]: {
            ...filterToClear,
            active: inactivate ? false : active,
            state: clearedState,
          },
        };
      });
    },
    [],
  );

  return [filters, setFilter, filteredData, clearFilter];
}
