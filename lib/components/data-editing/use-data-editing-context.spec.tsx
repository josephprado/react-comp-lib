import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DataEditingContext,
  DataEditingContextProvider,
  DataEditingContextType,
  KeyValue,
} from './data-editing-context-provider';
import { useDataEditingContext } from './use-data-editing-context';

let mockEditing: boolean;
let mockUpdates: KeyValue;
const mockHandleChange = vi.fn();
const mockOpenEditMode = vi.fn();
const mockCancelEditMode = vi.fn();

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...(actual as any),
    useContext: (context: any): DataEditingContextType | null => {
      return context.displayName === DataEditingContext.displayName
        ? {
            editing: mockEditing,
            updates: mockUpdates,
            handleChange: mockHandleChange,
            openEditMode: mockOpenEditMode,
            cancelEditMode: mockCancelEditMode,
          }
        : null;
    },
  };
});

const combineUpdatesIntoList = (updates: KeyValue) => {
  return Object.entries(updates)
    .map(([k, v]) => `${k}:${v as string}`)
    .join(';');
};

interface TestComponentProps {
  name?: string;
  value?: unknown;
  initUpdates?: KeyValue;
}

function TestComponent({
  name = '',
  value = '',
  initUpdates = {},
}: TestComponentProps) {
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
    </>
  );
}

describe(useDataEditingContext.name, () => {
  it('should provide access to a data-editing context', async () => {
    mockEditing = false;
    mockUpdates = {
      a: 'b',
      c: 'd',
    };

    const name = 'joe';
    const value = 'schmo';
    const initUpdates = {
      foo: 'bar',
      baz: 'bat',
    };

    const user = userEvent.setup();

    render(
      <DataEditingContextProvider>
        <TestComponent name={name} value={value} initUpdates={initUpdates} />
      </DataEditingContextProvider>,
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
