import { useContext } from 'react';
import { WizardContext, WizardContextType } from './wizard-context-provider';

/**
 * Provides access to a {@link WizardContext}. Must be descendant of a
 * `WizardContextProvider` or a component wrapped with the
 * `withWizardContext` HOC.
 *
 * @returns A {@link WizardContextType}.
 */
export const useWizardContext = (): WizardContextType =>
  useContext<WizardContextType>(WizardContext);
