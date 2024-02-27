import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DataEditingContext,
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

describe(useDataEditingContext.name, () => {
  it('should provide access to the editing state', () => {
    mockEditing = true;

    function TestComponent() {
      const { editing } = useDataEditingContext();
      return <div data-testid="editing">{editing.toString()}</div>;
    }

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

    function TestComponent() {
      const { updates } = useDataEditingContext();
      return <div data-testid="updates">{combineUpdatesIntoList(updates)}</div>;
    }

    render(<TestComponent />);

    const updates = screen.getByTestId('updates').innerHTML;
    expect(updates).toEqual(combineUpdatesIntoList(mockUpdates));
  });

  it('should provide access to the handleChange function', async () => {
    function TestComponent() {
      const { handleChange } = useDataEditingContext();
      return <button type="button" onClick={() => handleChange('x', 'y')} />;
    }

    const user = userEvent.setup();

    render(<TestComponent />);

    const button = screen.getByRole('button');
    await user.click(button);
    await waitFor(() => expect(mockHandleChange).toHaveBeenCalledOnce());
  });

  it('should provide access to the openEditMode function', async () => {
    function TestComponent() {
      const { openEditMode } = useDataEditingContext();
      return <button type="button" onClick={() => openEditMode()} />;
    }

    const user = userEvent.setup();

    render(<TestComponent />);

    const button = screen.getByRole('button');
    await user.click(button);
    await waitFor(() => expect(mockOpenEditMode).toHaveBeenCalledOnce());
  });

  it('should provide access to the cancelEditMode function', async () => {
    function TestComponent() {
      const { cancelEditMode } = useDataEditingContext();
      return <button type="button" onClick={() => cancelEditMode()} />;
    }

    const user = userEvent.setup();

    render(<TestComponent />);

    const button = screen.getByRole('button');
    await user.click(button);
    await waitFor(() => expect(mockCancelEditMode).toHaveBeenCalledOnce());
  });
});
