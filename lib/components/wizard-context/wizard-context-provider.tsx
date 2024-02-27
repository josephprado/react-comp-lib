import { PropsWithChildren, createContext, useMemo, useState } from 'react';
import { KeyValue } from '../data-editing-context/data-editing-context-provider';

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
  handleChange: (_name: string, _value: unknown) => {},
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
export function WizardContextProvider({ children }: PropsWithChildren) {
  const [values, setValues] = useState<KeyValue>({});
  const [stepIndex, setStepIndex] = useState<number>(0);

  const handleChange = (name: string, value: unknown) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const prevStep = () => setStepIndex((prev) => Math.max(prev - 1, 0));
  const nextStep = () => setStepIndex((prev) => prev + 1);

  const reset = () => {
    setValues({});
    setStepIndex(0);
  };

  const value = useMemo(() => {
    return {
      values,
      handleChange,
      stepIndex,
      prevStep,
      nextStep,
      reset,
    };
  }, [stepIndex, values]);

  return (
    <WizardContext.Provider value={value}>{children}</WizardContext.Provider>
  );
}
