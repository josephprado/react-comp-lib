import { useState } from 'react';

/**
 * The return type of the {@link useWizard} hook.
 */
export interface WizardUtils<T extends object = any> {
  /**
   * An object storing data used by the wizard component.
   */
  values: Partial<T>;

  /**
   * Sets the named property in `values`.
   *
   * @param name The name of the property in `values`.
   * @param value The value of the named property.
   * @returns void.
   */
  setValue: <K extends keyof T>(name: K, value: T[K]) => void;

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
 * Provides utilities for step-by-step "wizard" components.
 *
 * @returns A {@link WizardUtils}.
 */
export function useWizard<T extends object = any>(): WizardUtils<T> {
  const [values, setValues] = useState<Partial<T>>({});
  const [stepIndex, setStepIndex] = useState<number>(0);

  const setValue = <K extends keyof T>(name: K, value: T[K]) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const prevStep = () => setStepIndex((prev) => Math.max(prev - 1, 0));
  const nextStep = () => setStepIndex((prev) => prev + 1);

  const reset = () => {
    setValues({});
    setStepIndex(0);
  };

  return { values, setValue, stepIndex, prevStep, nextStep, reset };
}
