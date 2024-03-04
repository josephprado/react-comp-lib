import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useDataEditing } from './use-data-editing';

type Thing = {
  foo: string;
  bar: number;
  baz: boolean;
};

function listUpdates(updates: Partial<Thing>) {
  return Object.entries(updates)
    .map(([k, v]) => `${k}:${v as string}`)
    .join(';');
}

describe(useDataEditing.name, () => {
  it('should default to non-editing state', () => {
    function TestComponent() {
      const { editing } = useDataEditing();
      return <div data-testid="editing">{editing.toString()}</div>;
    }

    render(<TestComponent />);

    const editing = screen.getByTestId('editing').innerHTML;
    expect(editing).toEqual('false');
  });

  it('should set editing to true when openEditMode called', async () => {
    function TestComponent() {
      const { editing, openEditMode } = useDataEditing();
      return (
        <button onClick={() => openEditMode()}>{editing.toString()}</button>
      );
    }

    const user = userEvent.setup();

    render(<TestComponent />);

    const button = screen.getByRole('button');
    expect(button.innerHTML).toEqual('false');

    await user.click(button);
    await waitFor(() => expect(button.innerHTML).toEqual('true'));
  });

  it('should initialize updates with initUpdates when openEditMode called', async () => {
    const initUpdates: Partial<Thing> = {
      foo: 'bar',
      bar: 1,
    };

    function TestComponent() {
      const { updates, openEditMode } = useDataEditing<Thing>();
      return (
        <button onClick={() => openEditMode(initUpdates)}>
          {listUpdates(updates)}
        </button>
      );
    }

    const user = userEvent.setup();

    render(<TestComponent />);

    const button = screen.getByRole('button');
    await user.click(button);
    await waitFor(() =>
      expect(button.innerHTML).toEqual(listUpdates(initUpdates)),
    );
  });

  it('should set editing to false when cancelEditMode called', async () => {
    function TestComponent() {
      const { editing, openEditMode, cancelEditMode } = useDataEditing();
      return (
        <>
          <div data-testid="editing">{editing.toString()}</div>
          <button data-testid="open-edit-mode" onClick={() => openEditMode()} />
          <button
            data-testid="cancel-edit-mode"
            onClick={() => cancelEditMode()}
          />
        </>
      );
    }

    const user = userEvent.setup();

    render(<TestComponent />);

    const editing = screen.getByTestId('editing');
    const openEditMode = screen.getByTestId('open-edit-mode');
    const cancelEditMode = screen.getByTestId('cancel-edit-mode');

    await user.click(openEditMode);
    await waitFor(() => expect(editing.innerHTML).toEqual('true'));

    await user.click(cancelEditMode);
    await waitFor(() => expect(editing.innerHTML).toEqual('false'));
  });

  it('should clear updates when cancelEditMode called', async () => {
    const initUpdates: Thing = {
      foo: 'bar',
      bar: 1,
      baz: true,
    };

    function TestComponent() {
      const { updates, openEditMode, cancelEditMode } = useDataEditing<Thing>();
      return (
        <>
          <div data-testid="updates">{listUpdates(updates)}</div>
          <button
            data-testid="open-edit-mode"
            onClick={() => openEditMode(initUpdates)}
          />
          <button
            data-testid="cancel-edit-mode"
            onClick={() => cancelEditMode()}
          />
        </>
      );
    }

    const user = userEvent.setup();

    render(<TestComponent />);

    const updates = screen.getByTestId('updates');

    const openEditMode = screen.getByTestId('open-edit-mode');
    await user.click(openEditMode);
    await waitFor(() =>
      expect(updates.innerHTML).toEqual(listUpdates(initUpdates)),
    );

    const cancelEditMode = screen.getByTestId('cancel-edit-mode');
    await user.click(cancelEditMode);
    await waitFor(() => expect(updates.innerHTML).toEqual(listUpdates({})));
  });

  it('should update the named value when updateValue called', async () => {
    const initUpdates: Thing = {
      foo: 'bar',
      bar: 1,
      baz: true,
    };

    function TestComponent() {
      const { updates, updateValue, openEditMode } = useDataEditing<Thing>();
      return (
        <>
          <div data-testid="updates">{listUpdates(updates)}</div>
          <button
            data-testid="open-edit-mode"
            onClick={() => openEditMode(initUpdates)}
          />
          <button
            data-testid="update-value"
            onClick={() => updateValue('baz', false)}
          />
        </>
      );
    }

    const user = userEvent.setup();

    render(<TestComponent />);

    const updates = screen.getByTestId('updates');

    const openEditMode = screen.getByTestId('open-edit-mode');
    await user.click(openEditMode);
    await waitFor(() =>
      expect(updates.innerHTML).toEqual(listUpdates(initUpdates)),
    );

    const updateValue = screen.getByTestId('update-value');
    await user.click(updateValue);
    await waitFor(() =>
      expect(updates.innerHTML).toEqual(
        listUpdates({ ...initUpdates, baz: false }),
      ),
    );
  });
});
