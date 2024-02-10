import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useContext } from 'react';
import {
  ExpandingContext,
  ExpandingContextProvider,
} from './expanding-context-provider';

function TestComponent() {
  const { expanded, setExpanded } = useContext(ExpandingContext);
  return (
    <div
      data-testid="test-component"
      onClick={() => setExpanded((prev) => !prev)}
    >
      {expanded.toString()}
    </div>
  );
}

describe(ExpandingContextProvider.name, () => {
  it.each([[true], [false], [undefined]])(
    'should render the children (isExpanded=%s)',
    (isExpanded?: boolean) => {
      const childText = 'Hello';

      render(
        <ExpandingContextProvider isExpanded={isExpanded}>
          <div>{childText}</div>
        </ExpandingContextProvider>,
      );

      const child = screen.getByText(childText);
      expect(child).toBeInTheDocument();
    },
  );

  it.each([[true], [false], [undefined]])(
    'should set the initial expanded state (isExpanded=%s)',
    (isExpanded?: boolean) => {
      render(
        <ExpandingContextProvider isExpanded={isExpanded}>
          <TestComponent />
        </ExpandingContextProvider>,
      );

      const actual = screen.getByTestId('test-component')?.innerHTML;
      expect(actual).toEqual((!!isExpanded).toString());
    },
  );

  it.each([[true], [false], [undefined]])(
    'should update the expanded state when setExpanded called (isExpanded=%s)',
    async (isExpanded?: boolean) => {
      const user = userEvent.setup();

      render(
        <ExpandingContextProvider isExpanded={isExpanded}>
          <TestComponent />
        </ExpandingContextProvider>,
      );

      const testComponent = screen.getByTestId('test-component');
      await user.click(testComponent);

      await waitFor(() =>
        expect(testComponent.innerHTML).toEqual((!isExpanded).toString()),
      );
    },
  );
});
