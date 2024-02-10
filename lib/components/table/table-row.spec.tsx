import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TableRow } from './table-row';

describe(TableRow.name, () => {
  it.each([
    [[1]],
    [[1, 2]],
    [[1, 2, 3]],
    [['a']],
    [['a', 'b']],
    [['a', 'b', 'c']],
    [[1, 'b', 3]],
    [['a', 2, 'c']],
  ])('should render the row cells', (rowCells: Array<string | number>) => {
    render(
      <table>
        <tbody>
          <TableRow cells={rowCells} />
        </tbody>
      </table>,
    );

    const cells = rowCells.map(
      (content) => screen.getByText(content).innerHTML,
    );

    expect(cells).toEqual(rowCells.map((x) => x.toString()));
  });

  it('should call onRowClick() when the row is clicked', async () => {
    const mockOnRowClick = vi.fn();
    const user = userEvent.setup();

    render(
      <table>
        <tbody>
          <TableRow cells={[1, 2, 3]} onRowClick={mockOnRowClick} />
        </tbody>
      </table>,
    );

    const row = screen.getByRole('row');
    await user.click(row);

    expect(mockOnRowClick).toHaveBeenCalledOnce();
  });
});
