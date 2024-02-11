import { ComponentType } from 'react';
import { DataEditingContextProvider } from './data-editing-context-provider';

/**
 * A Higher Order Component that wraps the given component in a
 * {@link DataEditingContextProvider}. The `WrappedComponent` and its descendants
 * can access `DataEditingContext` via the `useDataEditingContext` hook.
 *
 * @example
 * ```
 * function DataEditingComponent() {
 *   const { editing } = useDataEditingContext();
 *   console.log(editing); // false
 *   ...
 * }
 * export withDataEditingContext(DataEditingComponent);
 * ```
 * @param WrappedComponent A React component.
 * @returns A JSX element.
 */
export function withDataEditingContext<P extends object>(
  WrappedComponent: ComponentType<P>,
) {
  return (props: P) => {
    return (
      <DataEditingContextProvider>
        <WrappedComponent {...props} />
      </DataEditingContextProvider>
    );
  };
}
