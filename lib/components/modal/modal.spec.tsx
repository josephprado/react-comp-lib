import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal } from './modal';

describe(Modal.name, () => {
  it('should render the child component', () => {
    const childText = 'Hello';

    render(<Modal onClose={vi.fn()}>{childText}</Modal>);

    const child = screen.getByText(childText);
    expect(child).toBeInTheDocument();
  });

  it.each([[undefined], [false], [true]])(
    'should call onClose() when Escape pressed and closeOnEscape is true (closeOnOutsideClick=%s)',
    async (closeOnOutsideClick?: boolean) => {
      const mockOnClose = vi.fn();
      const user = userEvent.setup();

      render(
        <Modal
          onClose={mockOnClose}
          closeOnEscape
          closeOnOutsideClick={closeOnOutsideClick}
        >
          <></>
        </Modal>,
      );

      await user.keyboard('{Escape}');
      await waitFor(() => expect(mockOnClose).toHaveBeenCalledOnce());
    },
  );

  it.each([
    [undefined, undefined],
    [undefined, false],
    [undefined, true],
    [false, undefined],
    [false, false],
    [false, true],
  ])(
    'should not call onClose() when Escape pressed and closeOnEscape is %s (closeOnOutsideClick=%s)',
    async (closeOnEscape?: boolean, closeOnOutsideClick?: boolean) => {
      const mockOnClose = vi.fn();
      const user = userEvent.setup();

      render(
        <Modal
          onClose={mockOnClose}
          closeOnEscape={closeOnEscape}
          closeOnOutsideClick={closeOnOutsideClick}
        >
          <></>
        </Modal>,
      );

      await user.keyboard('{Escape}');
      await waitFor(() => expect(mockOnClose).not.toHaveBeenCalled());
    },
  );

  it.each([[undefined], [false], [true]])(
    'should call onClose() when outside clicked and closeOnOutsideClick is true (closeOnEscape=%s)',
    async (closeOnEscape?: boolean) => {
      const mockOnClose = vi.fn();
      const user = userEvent.setup();

      render(
        <div>
          <div data-testid="outside" />
          <Modal
            onClose={mockOnClose}
            closeOnEscape={closeOnEscape}
            closeOnOutsideClick
          >
            <></>
          </Modal>
        </div>,
      );

      const outside = screen.getByTestId('outside');
      await user.click(outside);
      await waitFor(() => expect(mockOnClose).toHaveBeenCalledOnce());
    },
  );

  it.each([
    [undefined, undefined],
    [undefined, false],
    [undefined, true],
    [false, undefined],
    [false, false],
    [false, true],
  ])(
    'should not call onClose() when outside clicked and closeOnOutsideClick is %s (closeOnEscape=%s)',
    async (closeOnOutsideClick?: boolean, closeOnEscape?: boolean) => {
      const mockOnClose = vi.fn();
      const user = userEvent.setup();

      render(
        <div>
          <div data-testid="outside" />
          <Modal
            onClose={mockOnClose}
            closeOnEscape={closeOnEscape}
            closeOnOutsideClick={closeOnOutsideClick}
          >
            <></>
          </Modal>
        </div>,
      );

      const outside = screen.getByTestId('outside');
      await user.click(outside);
      await waitFor(() => expect(mockOnClose).not.toHaveBeenCalled());
    },
  );
});
