import { PropsWithChildren, createContext, useMemo, useState } from 'react';

export interface KeyValue {
  [key: string]: unknown;
}

/**
 * The type of {@link DataEditingContext}.
 */
export interface DataEditingContextType {
  /**
   * True when in the editing state, and false when not.
   */
  editing: boolean;

  /**
   * An object containing updated values of the data.
   */
  updates: KeyValue;

  /**
   * Sets the named property in `updates`.
   *
   * @param name The name of the property in `updates`.
   * @param value The value of the named property.
   * @returns void.
   */
  handleChange: (name: string, value: unknown) => void;

  /**
   * Sets `editing` to true and initializes `updates` with `initUpdates`.
   *
   * @param initUpdates An object to initialize `updates`.
   * @returns void.
   */
  openEditMode: (initUpdates?: KeyValue) => void;

  /**
   * Sets `editing` to false and clears `updates`.
   *
   * @returns void.
   */
  cancelEditMode: () => void;
}

/**
 * Maintains state and functions used by components with editable data.
 */
export const DataEditingContext = createContext<DataEditingContextType>({
  editing: false,
  updates: {},
  handleChange: (_key: string, _value: unknown) => {},
  openEditMode: (_initUpdates?: KeyValue) => {},
  cancelEditMode: () => {},
});

/**
 * Provides a {@link DataEditingContext} to its descendants.
 *
 * @param props Children
 * @returns A context provider.
 */
export function DataEditingContextProvider({ children }: PropsWithChildren) {
  const [editing, setEditing] = useState<boolean>(false);
  const [updates, setUpdates] = useState<KeyValue>({});

  const handleChange = (name: string, value: unknown) => {
    setUpdates((prev) => ({ ...prev, [name]: value }));
  };

  const openEditMode = (initUpdates?: KeyValue) => {
    setUpdates(initUpdates ?? {});
    setEditing(true);
  };

  const cancelEditMode = () => {
    setEditing(false);
    setUpdates({});
  };

  const value = useMemo(
    () => ({
      editing,
      updates,
      handleChange,
      openEditMode,
      cancelEditMode,
    }),
    [editing, updates],
  );

  return (
    <DataEditingContext.Provider value={value}>
      {children}
    </DataEditingContext.Provider>
  );
}
