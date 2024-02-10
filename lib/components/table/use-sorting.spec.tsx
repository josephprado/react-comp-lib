import { beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SortDir, SortKey, useSorting } from './use-sorting';

interface T {
  id: number;
  a: string;
  b: string;
  c: number;
}

interface TestComponentProps {
  rows: T[];
  defaultSortKey?: SortKey<T>;
  defaultSortDir?: SortDir;
}

function TestComponent({
  rows,
  defaultSortKey,
  defaultSortDir,
}: TestComponentProps) {
  const [sortKey, sortDir, sortFn, sortedRows] = useSorting(
    rows,
    defaultSortKey,
    defaultSortDir,
  );

  return (
    <>
      <div data-testid="sort-key">{sortKey}</div>
      <div data-testid="sort-dir">{sortDir}</div>
      <table>
        <thead>
          <tr>
            {['a', 'b', 'c'].map((key) => (
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
      { id: 1, a: 'A', b: 'B', c: 3 },
      { id: 2, a: 'B', b: 'C', c: 1 },
      { id: 3, a: 'C', b: 'A', c: 2 },
    ];
  });

  it.each([
    ['a' as SortKey<T>, 'up' as SortDir, [1, 2, 3]],
    ['a' as SortKey<T>, 'down' as SortDir, [3, 2, 1]],
    ['b' as SortKey<T>, 'up' as SortDir, [3, 1, 2]],
    ['b' as SortKey<T>, 'down' as SortDir, [2, 1, 3]],
    ['c' as SortKey<T>, 'up' as SortDir, [2, 3, 1]],
    ['c' as SortKey<T>, 'down' as SortDir, [1, 3, 2]],
  ])(
    'should sort by the default sortKey and sortDir as expected (key=%s, dir=%s)',
    (key: SortKey<T>, dir: SortDir, expected: number[]) => {
      render(
        <TestComponent rows={rows} defaultSortKey={key} defaultSortDir={dir} />,
      );

      const results: number[] = [];

      for (let i = 0; i < rows.length; i++)
        results.push(+screen.getByTestId(`row${i}`).innerHTML);

      const sortKey = screen.getByTestId('sort-key').innerHTML;
      const sortDir = screen.getByTestId('sort-dir').innerHTML;

      expect(results).toEqual(expected);
      expect(sortKey).toEqual(key);
      expect(sortDir).toEqual(dir);
    },
  );

  it.each([
    ['a' as SortKey<T>, [1, 2, 3]],
    ['b' as SortKey<T>, [3, 1, 2]],
    ['c' as SortKey<T>, [2, 3, 1]],
  ])(
    'should sort the data as expected',
    async (key: SortKey<T>, expected: number[]) => {
      const user = userEvent.setup();

      render(<TestComponent rows={rows} />);

      const button = screen.getByRole('button', { name: key });
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

    ['c' as SortKey<T>, 1, [2, 3, 1]],
    ['c' as SortKey<T>, 2, [1, 3, 2]],
    ['c' as SortKey<T>, 3, [1, 2, 3]], // default state of rows
  ])(
    'should sort in the order: up > down > default when sortFn() called 3 times on same key (key=%s, clicks=%s)',
    async (key: SortKey<T>, clicks: number, expected: number[]) => {
      const user = userEvent.setup();

      render(<TestComponent rows={rows} />);

      const button = screen.getByRole('button', { name: key });

      for (let i = 0; i < clicks; i++) await user.click(button);

      const results = [];

      for (let i = 0; i < rows.length; i++)
        results.push(+screen.getByTestId(`row${i}`).innerHTML);

      expect(results).toEqual(expected);
    },
  );
});
