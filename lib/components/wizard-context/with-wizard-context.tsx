import { ComponentType } from 'react';
import { WizardContextProvider } from './wizard-context-provider';

/**
 * A Higher Order Component that wraps the given component in a
 * {@link WizardContextProvider}. The `WrappedComponent` and its descendants
 * can access `WizardContext` via the `useWizardContext` hook.
 *
 * @example
 * ```
 * function WizardComponent() {
 *   const { stepIndex } = useWizardContext();
 *   console.log(stepIndex); // 0
 *   ...
 * }
 * export withWizardContext(WizardComponent);
 * ```
 * @param WrappedComponent A React component.
 * @returns A JSX element.
 */
export function withWizardContext<P extends object>(
  WrappedComponent: ComponentType<P>,
) {
  return (props: P) => {
    return (
      <WizardContextProvider>
        <WrappedComponent {...props} />
      </WizardContextProvider>
    );
  };
}
