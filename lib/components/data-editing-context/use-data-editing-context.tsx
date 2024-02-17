import { useContext } from 'react';
import {
  DataEditingContext,
  DataEditingContextType,
} from './data-editing-context-provider';

/**
 * Provides access to a {@link DataEditingContext}. Must be descendant of a
 * `DataEditingContextProvider` or a component wrapped with the
 * `withDataEditingContext` HOC.
 *
 * @returns A {@link DataEditingContextType}.
 */
export const useDataEditingContext = (): DataEditingContextType =>
  useContext<DataEditingContextType>(DataEditingContext);
