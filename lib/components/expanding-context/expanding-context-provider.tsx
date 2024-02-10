import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from 'react';

/**
 * The type of {@link ExpandingContext}.
 */
export interface ExpandingContextType {
  /**
   * True when in the expanded state, and false when contracted.
   */
  expanded: boolean;

  /**
   * A set state function for `expanded`.
   */
  setExpanded: Dispatch<SetStateAction<boolean>>;
}

/**
 * Maintains state and functions used by components that expand and contract.
 */
export const ExpandingContext = createContext<ExpandingContextType>({
  expanded: false,
  setExpanded: () => {},
});

/**
 * Props for the {@link ExpandingContextProvider} component.
 */
export interface ExpandingContextProviderProps {
  /**
   * The initial state of the expanding component.
   */
  isExpanded?: boolean;
}

/**
 * Provides an {@link ExpandingContext} to its descendants.
 *
 * @param props {@link ExpandingContextProviderProps}
 * @returns A context provider.
 */
export function ExpandingContextProvider({
  isExpanded,
  children,
}: PropsWithChildren<ExpandingContextProviderProps>) {
  const [expanded, setExpanded] = useState<boolean>(!!isExpanded);

  return (
    <ExpandingContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </ExpandingContext.Provider>
  );
}
