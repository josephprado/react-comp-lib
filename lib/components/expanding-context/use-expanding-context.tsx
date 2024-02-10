import { useContext } from 'react';
import {
  ExpandingContext,
  ExpandingContextType,
} from './expanding-context-provider';

/**
 * Provides access to an {@link ExpandingContext}. Must be descendant of an
 * `ExpandingContextProvider` or a component wrapped with the
 * `withExpandingContext` HOC.
 *
 * @returns An {@link ExpandingContextType}.
 */
export const useExpandingContext = (): ExpandingContextType =>
  useContext<ExpandingContextType>(ExpandingContext);
