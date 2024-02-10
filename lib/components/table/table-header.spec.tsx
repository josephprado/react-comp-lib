import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeaderCell, TableHeader } from './table-header';
import { SortDir, SortKey } from './use-sorting';

interface T {
  a: any;
  b: any;
  c: any;
}

describe(TableHeader.name, () => {
  it.each([
    [[1]],
    [[1, 2]],
    [[1, 2, 3]],
    [['a']],
    [['a', 'b']],
    [['a', 'b', 'c']],
    [[1, 'b', 3]],
    [['a', 2, 'c']],
  ])(
    'should render the header cells',
    (headerCells: Array<string | number>) => {
      render(
        <table>
          <TableHeader cells={headerCells.map((content) => ({ content }))} />
        </table>,
      );

      const cells = headerCells.map(
        (content) => screen.getByText(content).innerHTML,
      );

      expect(cells).toEqual(headerCells.map((x) => x.toString()));
    },
  );

  it.each([
    ['a' as SortKey<T>, 'up' as SortDir],
    ['a' as SortKey<T>, 'down' as SortDir],
    ['b' as SortKey<T>, 'up' as SortDir],
    ['b' as SortKey<T>, 'down' as SortDir],
    ['c' as SortKey<T>, 'up' as SortDir],
    ['c' as SortKey<T>, 'down' as SortDir],
  ])(
    'should display the appropriate sort caret on the active sorted column (key=%s, dir=%s)',
    (key: SortKey<T>, dir: SortDir) => {
      const headerCells: HeaderCell<{ a: any; b: any; c: any }>[] = [
        { content: 1, key: 'a' },
        { content: 2, key: 'b' },
        { content: 3, key: 'c' },
      ];

      render(
        <table>
          <TableHeader
            cells={headerCells}
            sortKey={key}
            sortDir={dir}
            sortFn={(_) => {}}
          />
        </table>,
      );

      const caret = dir === 'up' ? '▲' : '▼';
      const cell = screen.getByRole('columnheader', {
        name: `${headerCells.find(({ content }) => content)?.content} ${caret}`,
      });

      expect(cell).toBeInTheDocument();
    },
  );

  it.todo('should hide the sort caret on all columns not sorted');

  it.todo('should change the sort caret when header cell clicked');
});
