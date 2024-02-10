import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TableBody } from './table-body';

describe(TableBody.name, () => {
  it('should render the child', () => {
    const childText = 'Hello';

    render(
      <table>
        <TableBody>
          <tr>
            <td>{childText}</td>
          </tr>
        </TableBody>
      </table>,
    );

    const child = screen.getByText(childText);
    expect(child).toBeInTheDocument();
  });
});
