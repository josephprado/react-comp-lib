import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useContext } from 'react';
import { DataEditingContextType } from '../data-editing-context/data-editing-context-provider';
import {
  WizardContext,
  WizardContextProvider,
} from './wizard-context-provider';

vi.mock('../data-editing-context/use-data-editing-context', () => ({
  useDataEditingContext: (): DataEditingContextType => ({
    editing: false,
    updates: {},
    handleChange: vi.fn(),
    openEditMode: vi.fn(),
    cancelEditMode: vi.fn(),
  }),
}));

function TestComponent() {
  const { stepIndex, prevStep, nextStep, reset } = useContext(WizardContext);
  return (
    <>
      <div data-testid="step-index">{stepIndex.toString()}</div>
      <button
        data-testid="prev-step"
        type="button"
        onClick={() => prevStep()}
      />
      <button
        data-testid="next-step"
        type="button"
        onClick={() => nextStep()}
      />
      <button data-testid="reset" type="button" onClick={() => reset()} />
    </>
  );
}

/*
  Note: Not testing `values` and `handleChange` as those are merely imported
  from DataEditingContext and re-exported.
*/
describe(WizardContextProvider.name, () => {
  it('should render the children', () => {
    const childText = 'Hello';

    render(
      <WizardContextProvider>
        <div>{childText}</div>
      </WizardContextProvider>,
    );

    const child = screen.getByText(childText);
    expect(child).toBeInTheDocument();
  });

  it('should initiate stepIndex to 0', () => {
    render(
      <WizardContextProvider>
        <TestComponent />
      </WizardContextProvider>,
    );

    const stepIndex = screen.getByTestId('step-index').innerHTML;
    expect(stepIndex).toEqual('0');
  });

  it.each([[1], [2], [5], [10]])(
    'should increment stepIndex by one when nextStep called (n=%s)',
    async (n: number) => {
      const user = userEvent.setup();

      render(
        <WizardContextProvider>
          <TestComponent />
        </WizardContextProvider>,
      );

      const stepIndex = screen.getByTestId('step-index');
      expect(stepIndex.innerHTML).toEqual('0');

      const nextStep = screen.getByTestId('next-step');
      for (let i = 0; i < n; i++) await user.click(nextStep);

      await waitFor(() => expect(stepIndex.innerHTML).toEqual(n.toString()));
    },
  );

  it.each([[1], [2], [5], [10]])(
    'should decrement stepIndex by one when prevStep called (currentStep=%s)',
    async (currentStep: number) => {
      const user = userEvent.setup();

      render(
        <WizardContextProvider>
          <TestComponent />
        </WizardContextProvider>,
      );

      const nextStep = screen.getByTestId('next-step');
      for (let i = 0; i < currentStep; i++) await user.click(nextStep);

      const stepIndex = screen.getByTestId('step-index');
      await waitFor(() =>
        expect(stepIndex.innerHTML).toEqual(currentStep.toString()),
      );

      const prevStep = screen.getByTestId('prev-step');
      await user.click(prevStep);

      await waitFor(() =>
        expect(stepIndex.innerHTML).toEqual((currentStep - 1).toString()),
      );
    },
  );

  it('should not decrement stepIndex below 0 when prevStep called', async () => {
    const user = userEvent.setup();

    render(
      <WizardContextProvider>
        <TestComponent />
      </WizardContextProvider>,
    );

    const stepIndex = screen.getByTestId('step-index');
    expect(stepIndex.innerHTML).toEqual('0');

    const prevStep = screen.getByTestId('prev-step');
    await user.click(prevStep);

    await waitFor(() => expect(stepIndex.innerHTML).toEqual('0'));
  });

  it.each([[1], [2], [5], [10]])(
    'should set stepIndex to 0 when reset called (currentStep=%s)',
    async (currentStep: number) => {
      const user = userEvent.setup();

      render(
        <WizardContextProvider>
          <TestComponent />
        </WizardContextProvider>,
      );

      const nextStep = screen.getByTestId('next-step');
      for (let i = 0; i < currentStep; i++) await user.click(nextStep);

      const stepIndex = screen.getByTestId('step-index');
      await waitFor(() =>
        expect(stepIndex.innerHTML).toEqual(currentStep.toString()),
      );

      const reset = screen.getByTestId('reset');
      await user.click(reset);

      await waitFor(() => expect(stepIndex.innerHTML).toEqual('0'));
    },
  );
});
