import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  ExpandingContext,
  ExpandingContextProvider,
  ExpandingContextType,
} from './expanding-context-provider';
import { useExpandingContext } from './use-expanding-context';

let mockExpandingContext: ExpandingContextType;

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...(actual as any),
    useContext: (context: any) => {
      return context.displayName === ExpandingContext.displayName
        ? mockExpandingContext
        : {};
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
      mockExpandingContext = {
        expanded: !!isExpanded,
        setExpanded: vi.fn(),
      };

      const user = userEvent.setup();

      render(
        <ExpandingContextProvider isExpanded={isExpanded}>
          <TestComponent />
        </ExpandingContextProvider>,
      );

      const testComponent = screen.getByTestId('test-component');
      expect(testComponent?.innerHTML).toEqual((!!isExpanded).toString());

      await user.click(testComponent);
      await waitFor(() =>
        expect(mockExpandingContext.setExpanded).toHaveBeenCalledOnce(),
      );
    },
  );
});
