import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OutsideClickHandler } from './outside-click-handler';

describe(OutsideClickHandler.name, () => {
  it('should render the child component', () => {
    const childText = 'Hello';

    render(
      <OutsideClickHandler onOutsideClick={() => {}}>
        {childText}
      </OutsideClickHandler>,
    );

    const child = screen.getByText(childText);
    expect(child).toBeInTheDocument();
  });

  it('should not call onOutsideClick() when inside clicked', async () => {
    const mockOnOutsideClick = vi.fn();
    const user = userEvent.setup();

    render(
      <div>
        <div>foo</div>
        <OutsideClickHandler onOutsideClick={mockOnOutsideClick}>
          <div data-testid="inside">bar</div>
        </OutsideClickHandler>
      </div>,
    );

    const insideElement = screen.getByTestId('inside');
    await user.click(insideElement);

    expect(mockOnOutsideClick).not.toHaveBeenCalled();
  });

  it('should call onOutsideClick() when outside clicked', async () => {
    const mockOnOutsideClick = vi.fn();
    const user = userEvent.setup();

    render(
      <div>
        <div data-testid="outside">foo</div>
        <OutsideClickHandler onOutsideClick={mockOnOutsideClick}>
          <div>bar</div>
        </OutsideClickHandler>
      </div>,
    );

    const outsideElement = screen.getByTestId('outside');
    await user.click(outsideElement);

    expect(mockOnOutsideClick).toHaveBeenCalledOnce();
  });
});
