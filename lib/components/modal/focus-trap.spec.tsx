import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FocusTrap } from './focus-trap';

describe(FocusTrap.name, () => {
  it('should render the child component', () => {
    const childText = 'Hello';

    render(<FocusTrap>{childText}</FocusTrap>);

    const child = screen.getByText(childText);
    expect(child).toBeInTheDocument();
  });

  it.each([
    [false, false, false],
    [false, false, true],
    [false, true, false],
    [false, true, true],
    [true, false, false],
    [true, false, true],
    [true, true, false],
  ])(
    'should tab through only the non-disabled tabbable elements inside the trap (disabled: %s, %s, %s)',
    async (d0: boolean, d1: boolean, d2: boolean) => {
      const user = userEvent.setup();

      render(
        <div>
          <button type="button" data-testid="outside-0" />
          <FocusTrap>
            <button
              type="button"
              data-testid={`inside-${d0 ? '' : '0'}`}
              disabled={d0}
            />
            <button
              type="button"
              data-testid={`inside-${d1 ? '' : d0 ? '0' : '1'}`}
              disabled={d1}
            />
            <button
              type="button"
              data-testid={`inside-${d2 ? '' : d0 && d1 ? '0' : d0 || d1 ? '1' : '2'}`}
              disabled={d2}
            />
          </FocusTrap>
          <button type="button" data-testid="outside-1" />
        </div>,
      );

      const enabledCount = [d0, d1, d2].filter((disabled) => !disabled).length;

      for (let i = 0; i < 8; i++) {
        await user.keyboard('{Tab}');
        const el = screen.getByTestId('inside-' + (i % enabledCount));
        await waitFor(() => expect(el).toHaveFocus());
      }
    },
  );

  it.each([
    [false, false, false],
    [false, false, true],
    [false, true, false],
    [false, true, true],
    [true, false, false],
    [true, false, true],
    [true, true, false],
  ])(
    'should reverse tab through only the non-disabled tabbable elements inside the trap (disabled: %s, %s, %s)',
    async (d0: boolean, d1: boolean, d2: boolean) => {
      const user = userEvent.setup();

      render(
        <div>
          <button type="button" data-testid="outside-0" />
          <FocusTrap>
            <button
              type="button"
              data-testid={`inside-${d0 ? '' : '0'}`}
              disabled={d0}
            />
            <button
              type="button"
              data-testid={`inside-${d1 ? '' : d0 ? '0' : '1'}`}
              disabled={d1}
            />
            <button
              type="button"
              data-testid={`inside-${d2 ? '' : d0 && d1 ? '0' : d0 || d1 ? '1' : '2'}`}
              disabled={d2}
            />
          </FocusTrap>
          <button type="button" data-testid="outside-1" />
        </div>,
      );

      const enabledCount = [d0, d1, d2].filter((disabled) => !disabled).length;

      for (let i = enabledCount - 1; i >= 0; i--) {
        await user.keyboard('{Shift>}{Tab}{/Shift}');
        const el = screen.getByTestId('inside-' + (i % enabledCount));
        await waitFor(() => expect(el).toHaveFocus());
      }
    },
  );
});
