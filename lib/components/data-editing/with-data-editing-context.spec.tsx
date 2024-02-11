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

const combineUpdatesIntoList = (updates: KeyValue) => {
  return Object.entries(updates)
    .map(([k, v]) => `${k}:${v as string}`)
    .join(';');
};

interface WrappedComponentProps {
  name?: string;
  value?: unknown;
  initUpdates?: KeyValue;
}

function WrappedComponent({
  name = '',
  value = '',
  initUpdates = {},
  children,
}: PropsWithChildren<WrappedComponentProps>) {
  const { editing, updates, handleChange, openEditMode, cancelEditMode } =
    useDataEditingContext();

  return (
    <>
      <div data-testid="editing">{editing.toString()}</div>
      <div data-testid="updates">{combineUpdatesIntoList(updates)}</div>
      <div
        data-testid="handle-change"
        onClick={() => handleChange(name, value)}
      />
      <div data-testid="open-edit" onClick={() => openEditMode(initUpdates)} />
      <div data-testid="cancel-edit" onClick={() => cancelEditMode()} />
      {children}
    </>
  );
}

const TestComponent = withDataEditingContext(WrappedComponent);

describe(withDataEditingContext.name, () => {
  beforeEach(() => {
    mockEditing = false;
    mockUpdates = {
      a: 'b',
      c: 'd',
    };
  });

  it('should render the children', () => {
    const childText = 'Hello';

    render(
      <TestComponent>
        <div>{childText}</div>
      </TestComponent>,
    );

    const child = screen.getByText(childText);
    expect(child).toBeInTheDocument();
  });

  it('should provide access to a data-editing context', async () => {
    const name = 'joe';
    const value = 'schmo';
    const initUpdates = {
      foo: 'bar',
      baz: 'bat',
    };

    const user = userEvent.setup();

    render(
      <TestComponent name={name} value={value} initUpdates={initUpdates} />,
    );

    const editing = screen.getByTestId('editing').innerHTML;
    expect(editing).toEqual(mockEditing.toString());

    const updates = screen.getByTestId('updates').innerHTML;
    expect(updates).toEqual(combineUpdatesIntoList(mockUpdates));

    const handleChange = screen.getByTestId('handle-change');
    await user.click(handleChange);
    await waitFor(() =>
      expect(mockHandleChange).toHaveBeenCalledWith(name, value),
    );

    const openEdit = screen.getByTestId('open-edit');
    await user.click(openEdit);
    await waitFor(() =>
      expect(mockOpenEditMode).toHaveBeenCalledWith(initUpdates),
    );

    const cancelEdit = screen.getByTestId('cancel-edit');
    await user.click(cancelEdit);
    await waitFor(() => expect(mockCancelEditMode).toHaveBeenCalledOnce());
  });
});
