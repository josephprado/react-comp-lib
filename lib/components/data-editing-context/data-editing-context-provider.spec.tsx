import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useContext } from 'react';
import {
  DataEditingContext,
  DataEditingContextProvider,
  KeyValue,
} from './data-editing-context-provider';

describe(DataEditingContextProvider.name, () => {
  it('should render the children', () => {
    const childText = 'Hello';

    render(
      <DataEditingContextProvider>
        <div>{childText}</div>
      </DataEditingContextProvider>,
    );

    const child = screen.getByText(childText);
    expect(child).toBeInTheDocument();
  });

  it('should default to non-editing state', () => {
    function TestComponent() {
      const { editing } = useContext(DataEditingContext);
      return <div data-testid="editing">{editing.toString()}</div>;
    }

    render(
      <DataEditingContextProvider>
        <TestComponent />
      </DataEditingContextProvider>,
    );

    const editing = screen.getByTestId('editing').innerHTML;
    expect(editing).toEqual('false');
  });

  it('should set editing to true when openEditMode called', async () => {
    function TestComponent() {
      const { editing, openEditMode } = useContext(DataEditingContext);
      return (
        <button type="button" onClick={() => openEditMode()}>
          {editing.toString()}
        </button>
      );
    }

    const user = userEvent.setup();

    render(
      <DataEditingContextProvider>
        <TestComponent />
      </DataEditingContextProvider>,
    );

    const button = screen.getByRole('button');
    await user.click(button);
    await waitFor(() => expect(button.innerHTML).toEqual('true'));
  });

  it('should initialize updates with initUpdates when openEditMode called', async () => {
    const initUpdates: KeyValue = {
      foo: 'bar',
      baz: 'bat',
    };

    const combineUpdatesIntoList = (updates: KeyValue) => {
      return Object.entries(updates)
        .map(([k, v]) => `${k}:${v as string}`)
        .join(';');
    };

    function TestComponent() {
      const { updates, openEditMode } = useContext(DataEditingContext);
      return (
        <button type="button" onClick={() => openEditMode(initUpdates)}>
          {combineUpdatesIntoList(updates)}
        </button>
      );
    }

    const user = userEvent.setup();

    render(
      <DataEditingContextProvider>
        <TestComponent />
      </DataEditingContextProvider>,
    );

    const button = screen.getByRole('button');
    expect(button.innerHTML).toEqual('');

    await user.click(button);
    await waitFor(() =>
      expect(button.innerHTML).toEqual(combineUpdatesIntoList(initUpdates)),
    );
  });

  it('should set editing to false when cancelEditMode called', async () => {
    function TestComponent() {
      const { editing, openEditMode, cancelEditMode } =
        useContext(DataEditingContext);
      return (
        <>
          <div data-testid="editing">{editing.toString()}</div>
          <button
            type="button"
            data-testid="open-edit-mode"
            onClick={() => openEditMode()}
          />
          <button
            type="button"
            data-testid="cancel-edit-mode "
            onClick={() => cancelEditMode()}
          />
        </>
      );
    }

    const user = userEvent.setup();

    render(
      <DataEditingContextProvider>
        <TestComponent />
      </DataEditingContextProvider>,
    );

    const editing = screen.getByTestId('editing');

    const openEditMode = screen.getByTestId('open-edit-mode');
    await user.click(openEditMode);
    await waitFor(() => expect(editing.innerHTML).toEqual('true'));

    const cancelEditMode = screen.getByTestId('cancel-edit-mode');
    await user.click(cancelEditMode);
    await waitFor(() => expect(editing.innerHTML).toEqual('false'));
  });

  it('should update the value when handleChange called', async () => {
    const combineUpdatesIntoList = (updates: KeyValue) => {
      return Object.entries(updates)
        .map(([k, v]) => `${k}:${v as string}`)
        .join(';');
    };

    const name = 'foo';
    const value = 'bar';

    function TestComponent() {
      const { updates, handleChange } = useContext(DataEditingContext);
      return (
        <button type="button" onClick={() => handleChange(name, value)}>
          {combineUpdatesIntoList(updates)}
        </button>
      );
    }

    const user = userEvent.setup();

    render(
      <DataEditingContextProvider>
        <TestComponent />
      </DataEditingContextProvider>,
    );

    const button = screen.getByRole('button');
    expect(button.innerHTML).toEqual('');

    await user.click(button);
    await waitFor(() =>
      expect(button.innerHTML).toEqual(
        combineUpdatesIntoList({ [name]: value }),
      ),
    );
  });
});
