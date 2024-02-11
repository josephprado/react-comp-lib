import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useContext } from 'react';
import {
  DataEditingContext,
  DataEditingContextProvider,
  KeyValue,
} from './data-editing-context-provider';

interface TestComponentProps {
  name?: string;
  value?: unknown;
  initUpdates?: KeyValue;
}

const combineUpdatesIntoList = (updates: KeyValue) => {
  return Object.entries(updates)
    .map(([k, v]) => `${k}:${v as string}`)
    .join(';');
};

function TestComponent({ name, value, initUpdates }: TestComponentProps) {
  const { editing, updates, handleChange, openEditMode, cancelEditMode } =
    useContext(DataEditingContext);
  return (
    <>
      <div
        data-testid="editing"
        onClick={() => {
          editing ? cancelEditMode() : openEditMode(initUpdates);
        }}
      >
        {editing.toString()}
      </div>
      <div
        data-testid="value"
        onClick={() => {
          if (name && value) handleChange(name, value);
        }}
      >
        {name && value ? (updates[name] as string) : ''}
      </div>
      <div data-testid="updates">{combineUpdatesIntoList(updates)}</div>
    </>
  );
}

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
    render(
      <DataEditingContextProvider>
        <TestComponent />
      </DataEditingContextProvider>,
    );

    const editing = screen.getByTestId('editing').innerHTML;
    expect(editing).toEqual('false');
  });

  it('should set editing to true when openEditMode called', async () => {
    const user = userEvent.setup();

    render(
      <DataEditingContextProvider>
        <TestComponent />
      </DataEditingContextProvider>,
    );

    const editing = screen.getByTestId('editing');
    await user.click(editing);

    await waitFor(() => expect(editing.innerHTML).toEqual('true'));
  });

  it('should initialize updates with initUpdates when openEditMode called', async () => {
    const initUpdates: KeyValue = {
      foo: 'bar',
      baz: 'bat',
    };

    const user = userEvent.setup();

    render(
      <DataEditingContextProvider>
        <TestComponent initUpdates={initUpdates} />
      </DataEditingContextProvider>,
    );

    const editing = screen.getByTestId('editing');
    await user.click(editing);

    const updates = screen.getByTestId('updates').innerHTML;
    await waitFor(() =>
      expect(updates).toEqual(combineUpdatesIntoList(initUpdates)),
    );
  });

  it('should set editing to false when cancelEditMode called', async () => {
    const user = userEvent.setup();

    render(
      <DataEditingContextProvider>
        <TestComponent />
      </DataEditingContextProvider>,
    );

    const editing = screen.getByTestId('editing');
    await user.click(editing);
    await waitFor(() => expect(editing.innerHTML).toEqual('true'));

    await user.click(editing);
    await waitFor(() => expect(editing.innerHTML).toEqual('false'));
  });

  it('should update the value when handleChange called', async () => {
    const key = 'foo';
    const value = 'bar';

    const user = userEvent.setup();

    render(
      <DataEditingContextProvider>
        <TestComponent name={key} value={value} />
      </DataEditingContextProvider>,
    );

    const valueDiv = screen.getByTestId('value');
    await user.click(valueDiv);

    await waitFor(() => expect(valueDiv.innerHTML).toEqual(value));
  });
});
