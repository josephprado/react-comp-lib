import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropsWithChildren } from 'react';
import { useDataEditingContext } from './use-data-editing-context';
import { withDataEditingContext } from './with-data-editing-context';
import {
  DataEditingContextType,
  KeyValue,
} from './data-editing-context-provider';

let mockEditing: boolean;
let mockUpdates: KeyValue;
const mockHandleChange = vi.fn();
const mockOpenEditMode = vi.fn();
const mockCancelEditMode = vi.fn();

vi.mock('./use-data-editing-context', () => ({
  useDataEditingContext: (): DataEditingContextType => ({
    editing: mockEditing,
    updates: mockUpdates,
    handleChange: mockHandleChange,
    openEditMode: mockOpenEditMode,
    cancelEditMode: mockCancelEditMode,
  }),
}));

describe(withDataEditingContext.name, () => {
  beforeEach(() => {
    mockEditing = false;
    mockUpdates = {};
  });

  it('should render the children', () => {
    const childText = 'Hello';

    const TestComponent = withDataEditingContext(function ({
      children,
    }: PropsWithChildren) {
      return <>{children}</>;
    });

    render(
      <TestComponent>
        <div>{childText}</div>
      </TestComponent>,
    );

    const child = screen.getByText(childText);
    expect(child).toBeInTheDocument();
  });

  it('should provide access to the editing state', () => {
    mockEditing = true;

    const TestComponent = withDataEditingContext(function () {
      const { editing } = useDataEditingContext();
      return <div data-testid="editing">{editing.toString()}</div>;
    });

    render(<TestComponent />);

    const editing = screen.getByTestId('editing').innerHTML;
    expect(editing).toEqual(mockEditing.toString());
  });

  it('should provide access to the updates state', () => {
    mockUpdates = { foo: 'bar' };

    const combineUpdatesIntoList = (updates: KeyValue) => {
      return Object.entries(updates)
        .map(([k, v]) => `${k}:${v as string}`)
        .join(';');
    };

    const TestComponent = withDataEditingContext(function () {
      const { updates } = useDataEditingContext();
      return <div data-testid="updates">{combineUpdatesIntoList(updates)}</div>;
    });

    render(<TestComponent />);

    const updates = screen.getByTestId('updates').innerHTML;
    expect(updates).toEqual(combineUpdatesIntoList(mockUpdates));
  });

  it('should provide access to the handleChange function', async () => {
    const TestComponent = withDataEditingContext(function () {
      const { handleChange } = useDataEditingContext();
      return <button type="button" onClick={() => handleChange('x', 'y')} />;
    });

    const user = userEvent.setup();

    render(<TestComponent />);

    const button = screen.getByRole('button');
    await user.click(button);
    await waitFor(() => expect(mockHandleChange).toHaveBeenCalledOnce());
  });

  it('should provide access to the openEditMode function', async () => {
    const TestComponent = withDataEditingContext(function () {
      const { openEditMode } = useDataEditingContext();
      return <button type="button" onClick={() => openEditMode()} />;
    });

    const user = userEvent.setup();

    render(<TestComponent />);

    const button = screen.getByRole('button');
    await user.click(button);
    await waitFor(() => expect(mockOpenEditMode).toHaveBeenCalledOnce());
  });

  it('should provide access to the cancelEditMode function', async () => {
    const TestComponent = withDataEditingContext(function () {
      const { cancelEditMode } = useDataEditingContext();
      return <button type="button" onClick={() => cancelEditMode()} />;
    });

    const user = userEvent.setup();

    render(<TestComponent />);

    const button = screen.getByRole('button');
    await user.click(button);
    await waitFor(() => expect(mockCancelEditMode).toHaveBeenCalledOnce());
  });
});
