import { afterEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropsWithChildren } from 'react';
import { useExpandingContext } from './use-expanding-context';
import { withExpandingContext } from './with-expanding-context';
import { ExpandingContextType } from './expanding-context-provider';

let mockExpanded: boolean;
const mockSetExpanded = vi.fn();

vi.mock('./use-expanding-context', () => ({
  useExpandingContext: (): ExpandingContextType => ({
    expanded: mockExpanded,
    setExpanded: mockSetExpanded,
  }),
}));

function WrappedComponent({ children }: PropsWithChildren) {
  const { expanded, setExpanded } = useExpandingContext();
  return (
    <div
      data-testid="test-component"
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div data-testid="expanded">{expanded.toString()}</div>
      {children}
    </div>
  );
}

const getTestComponent = (isExpanded?: boolean) =>
  withExpandingContext(WrappedComponent, isExpanded);

describe(withExpandingContext.name, () => {
  afterEach(() => {
    mockExpanded = false;
  });

  it.each([[true], [false], [undefined]])(
    'should render the children (isExpanded=%s)',
    (isExpanded?: boolean) => {
      mockExpanded = !!isExpanded;

      const childText = 'Hello';
      const TestComponent = getTestComponent(isExpanded);

      render(
        <TestComponent>
          <div>{childText}</div>
        </TestComponent>,
      );

      const child = screen.getByText(childText);
      expect(child).toBeInTheDocument();
    },
  );

  it.each([[true], [false], [undefined]])(
    'should provide access to an expanding context (isExpanded=%s)',
    async (isExpanded?: boolean) => {
      mockExpanded = !!isExpanded;

      const user = userEvent.setup();

      const childText = 'Hello';
      const TestComponent = getTestComponent(isExpanded);

      render(
        <TestComponent>
          <div>{childText}</div>
        </TestComponent>,
      );

      const expanded = screen.getByTestId('expanded');
      expect(expanded.innerHTML).toEqual((!!isExpanded).toString());

      const testComponent = screen.getByTestId('test-component');
      await user.click(testComponent);
      await waitFor(() => expect(mockSetExpanded).toHaveBeenCalledOnce());
    },
  );
});
