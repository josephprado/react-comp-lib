import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ExpandingContext,
  ExpandingContextProvider,
  ExpandingContextType,
} from './expanding-context-provider';
import { useExpandingContext } from './use-expanding-context';

let mockExpanded: boolean;
const mockSetExpanded = vi.fn();

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...(actual as any),
    useContext: (context: any): ExpandingContextType | null => {
      return context.displayName === ExpandingContext.displayName
        ? {
            expanded: mockExpanded,
            setExpanded: mockSetExpanded,
          }
        : null;
    },
  };
});

function TestComponent() {
  const { expanded, setExpanded } = useExpandingContext();
  return (
    <div
      data-testid="test-component"
      onClick={() => setExpanded((prev) => !prev)}
    >
      {expanded.toString()}
    </div>
  );
}

describe(useExpandingContext.name, () => {
  it.each([[true], [false], [undefined]])(
    'should provide access to an expanding context (isExpanded=%s)',
    async (isExpanded?: boolean) => {
      mockExpanded = !!isExpanded;

      const user = userEvent.setup();

      render(
        <ExpandingContextProvider isExpanded={isExpanded}>
          <TestComponent />
        </ExpandingContextProvider>,
      );

      const testComponent = screen.getByTestId('test-component');
      expect(testComponent.innerHTML).toEqual((!!isExpanded).toString());

      await user.click(testComponent);
      await waitFor(() => expect(mockSetExpanded).toHaveBeenCalledOnce());
    },
  );
});
