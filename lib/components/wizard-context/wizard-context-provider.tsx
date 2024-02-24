import { PropsWithChildren, createContext, useMemo, useState } from 'react';
import { KeyValue } from '../data-editing-context/data-editing-context-provider';
import { useDataEditingContext } from '../data-editing-context/use-data-editing-context';
import { withDataEditingContext } from '../data-editing-context/with-data-editing-context';

/**
 * The type of {@link WizardContext}.
 */
export interface WizardContextType {
  /**
   * An object storing data used by the wizard component.
   */
  values: KeyValue;

  /**
   * Updates the named property in `values`.
   *
   * @param name The name of a property in `values`.
   * @param value The value of the named property.
   * @returns void.
   */
  handleChange: (name: string, value: unknown) => void;

  /**
   * The index of the currently active step.
   *
   * @default 0
   */
  stepIndex: number;

  /**
   * Decrements `stepIndex` by 1 (will not go below 0).
   *
   * @returns void.
   */
  prevStep: () => void;

  /**
   * Increments `stepIndex` by 1.
   *
   * @returns void.
   */
  nextStep: () => void;

  /**
   * Restores the initial state of `values` and `stepIndex`.
   *
   * @returns void.
   */
  reset: () => void;
}

/**
 * Maintains state and functions used by step-by-step "wizard" components.
 */
export const WizardContext = createContext<WizardContextType>({
  values: {},
  handleChange: (_key: string, _value: unknown) => {},
  stepIndex: 0,
  nextStep: () => {},
  prevStep: () => {},
  reset: () => {},
});

/**
 * Provides a {@link WizardContext} to its descendants.
 *
 * @param props Children
 * @returns A context provider.
 */
export const WizardContextProvider = withDataEditingContext(function ({
  children,
}: PropsWithChildren) {
  const { updates, handleChange, cancelEditMode } = useDataEditingContext();
  const [stepIndex, setStepIndex] = useState<number>(0);

  const value = useMemo(() => {
    const prevStep = () => setStepIndex((prev) => Math.max(prev - 1, 0));
    const nextStep = () => setStepIndex((prev) => prev + 1);

    const reset = () => {
      /*
      Sets updates/values to an empty object. It also sets the editing variable
      of DataEditingContext to false, but we are not using that value so it
      does not matter.
    */
      cancelEditMode();
      setStepIndex(0);
    };
    return {
      values: updates,
      handleChange,
      stepIndex,
      prevStep,
      nextStep,
      reset,
    };
  }, [cancelEditMode, handleChange, stepIndex, updates]);

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
});
