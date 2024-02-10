import { ComponentType } from 'react';
import { ExpandingContextProvider } from './expanding-context-provider';

/**
 * A Higher Order Component that wraps the given component in an
 * {@link ExpandingContextProvider}. The `WrappedComponent` and its descendants
 * can access `ExpandingContext` via the `useExpandingContext` hook.
 *
 * @example The below example creates an expanding component that defaults to
 * the expanded state when rendered for the first time.
 *
 * ```
 * function ExpandingComponent() {
 *   const { expanded } = useExpandingContext();
 *   console.log(expanded); // true
 *   ...
 * }
 * export withExpandingContext(ExpandingComponent, true);
 * ```
 * @param WrappedComponent A React component.
 * @param isExpanded The initial expanded state of the component.
 * @returns A JSX element.
 */
export function withExpandingContext<P extends object>(
  WrappedComponent: ComponentType<P>,
  isExpanded?: boolean,
) {
  return (props: P) => {
    return (
      <ExpandingContextProvider isExpanded={isExpanded}>
        <WrappedComponent {...props} />
      </ExpandingContextProvider>
    );
  };
}
