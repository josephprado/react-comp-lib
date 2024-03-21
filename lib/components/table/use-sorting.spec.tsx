import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  CompareFn,
  SortDir,
  SortKey,
  UseSortingProps,
  useSorting,
} from './use-sorting';

interface T {
  id: number;
  a: string;
  b: string;
  0: number;
  '': number;
  z: { x: number; y: number };
}

function TestComponent({
  data,
  defaultSortKey,
  defaultSortDir,
  compareFns,
}: UseSortingProps<T>) {
  const [sortKey, sortDir, sortFn, sortedRows] = useSorting<T>({
    data,
    defaultSortKey,
    defaultSortDir,
    compareFns,
  });

  return (
    <>
      <div data-testid="sort-key">{sortKey}</div>
      <div data-testid="sort-dir">{sortDir}</div>
      <table>
        <thead>
          <tr>
            {['a', 'b', 0, '', 'z'].map((key) => (
              <th key={key}>
                <button type="button" onClick={() => sortFn(key as SortKey<T>)}>
                  {key}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map(({ id }, i) => (
            <tr key={id}>
              <td data-testid={`row${i}`}>{id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
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
      render(
        <TestComponent
          data={rows}
          defaultSortKey={key}
          defaultSortDir={dir}
          compareFns={{ z: (a, b) => a.x - b.x }}
        />,
      );

      const results: number[] = [];

      for (let i = 0; i < rows.length; i++)
        results.push(+screen.getByTestId(`row${i}`).innerHTML);

      const sortKey = screen.getByTestId('sort-key').innerHTML;
      const sortDir = screen.getByTestId('sort-dir').innerHTML;

      expect(results).toEqual(expected);
      expect(sortKey).toEqual(key.toString());
      expect(sortDir).toEqual(dir);
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
    async (
      key: SortKey<T>,
      expected: number[],
      zCompareFn?: CompareFn<T['z']>,
    ) => {
      const user = userEvent.setup();

      render(<TestComponent data={rows} compareFns={{ z: zCompareFn }} />);

      const button = screen.getByRole('button', { name: key as string });
      await user.click(button);

      const results = [];

      for (let i = 0; i < rows.length; i++)
        results.push(+screen.getByTestId(`row${i}`).innerHTML);

      expect(results).toEqual(expected);
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
    async (key: SortKey<T>, clicks: number, expected: number[]) => {
      const user = userEvent.setup();

      render(
        <TestComponent data={rows} compareFns={{ z: (a, b) => a.y - b.y }} />,
      );

      const button = screen.getByRole('button', { name: key as string });

      for (let i = 0; i < clicks; i++) await user.click(button);

      const results = [];

      for (let i = 0; i < rows.length; i++)
        results.push(+screen.getByTestId(`row${i}`).innerHTML);

      expect(results).toEqual(expected);
    },
  );
});
