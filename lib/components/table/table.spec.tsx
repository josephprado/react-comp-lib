import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Table } from './table';

describe(Table.name, () => {
  it('should render the child', () => {
    const childText = 'Hello';

    render(
      <Table numCols={1}>
        <tbody>
          <tr>
            <td>{childText}</td>
          </tr>
        </tbody>
      </Table>,
    );

    const child = screen.getByText(childText);
    expect(child).toBeInTheDocument();
  });
});
