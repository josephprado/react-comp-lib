import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TableFooter } from './table-footer';

describe(TableFooter.name, () => {
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
    'should render the footer cells',
    (footerCells: Array<string | number>) => {
      render(
        <table>
          <TableFooter cells={footerCells.map((content) => content)} />
        </table>,
      );

      const cells = footerCells.map(
        (content) => screen.getByText(content).innerHTML,
      );

      expect(cells).toEqual(footerCells.map((x) => x.toString()));
    },
  );
});
