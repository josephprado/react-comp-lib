import { useState } from 'react';

/**
 * The return type of the {@link useDataEditing} hook.
 */
export interface DataEditingUtils<T extends object = any> {
  /**
   * True when in the editing state, and false when not.
   */
  editing: boolean;

  /**
   * An object containing updated values of the data.
   */
  updates: Partial<T>;

  /**
   * Sets the named property in `updates`.
   *
   * @param name The name of the property in `updates`.
   * @param value The value of the named property.
   * @returns void.
   */
  updateValue: <K extends keyof T>(name: K, value: T[K]) => void;

  /**
   * Sets `editing` to true and initializes `updates` with `initUpdates`.
   *
   * @param initUpdates An object to initialize `updates`.
   * @returns void.
   */
  openEditMode: (initUpdates?: Partial<T>) => void;

  /**
   * Sets `editing` to false and clears `updates`.
   *
   * @returns void.
   */
  cancelEditMode: () => void;
}

/**
 * Provides utilities for editing data.
 *
 * @returns A {@link DataEditingUtils}.
 */
export function useDataEditing<T extends object = any>(): DataEditingUtils<T> {
  const [editing, setEditing] = useState<boolean>(false);
  const [updates, setUpdates] = useState<Partial<T>>({});

  const updateValue = <K extends keyof T>(name: K, value: T[K]) => {
    setUpdates((prev) => ({ ...prev, [name]: value }));
  };

  const openEditMode = (initUpdates?: Partial<T>) => {
    setUpdates(structuredClone(initUpdates) ?? {});
    setEditing(true);
  };

  const cancelEditMode = () => {
    setEditing(false);
    setUpdates({});
  };

  return { editing, updates, updateValue, openEditMode, cancelEditMode };
}
