import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe(Button.name, () => {
  it('should render the children', () => {
    const name = 'Hello';
    const child = <div>{name}</div>;

    render(<Button>{child}</Button>);

    const button = screen.getByRole('button', { name });
    expect(button).toBeInTheDocument();
  });

  it('should call onClick when clicked and not disabled', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(<Button onClick={mockOnClick}>Hello</Button>);

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => expect(mockOnClick).toBeCalledTimes(1));
  });

  it('should not call onClick when clicked and disabled', async () => {
    const user = userEvent.setup();
    const mockOnClick = vi.fn();

    render(
      <Button onClick={mockOnClick} disabled={true}>
        Hello
      </Button>,
    );

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => expect(mockOnClick).not.toBeCalled());
  });
});
