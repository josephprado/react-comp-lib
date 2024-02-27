import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useContext } from 'react';
import {
  WizardContext,
  WizardContextProvider,
} from './wizard-context-provider';

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
    function TestComponent() {
      const { stepIndex } = useContext(WizardContext);
      return <div data-testid="step-index">{stepIndex}</div>;
    }

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
      function TestComponent() {
        const { stepIndex, nextStep } = useContext(WizardContext);
        return (
          <button type="button" onClick={nextStep}>
            {stepIndex}
          </button>
        );
      }

      const user = userEvent.setup();

      render(
        <WizardContextProvider>
          <TestComponent />
        </WizardContextProvider>,
      );

      const button = screen.getByRole('button');
      expect(button.innerHTML).toEqual('0');

      for (let i = 0; i < n; i++) await user.click(button);

      await waitFor(() => expect(button.innerHTML).toEqual(n.toString()));
    },
  );

  it.each([[1], [2], [5], [10]])(
    'should decrement stepIndex by one when prevStep called (currentStep=%s)',
    async (currentStep: number) => {
      function TestComponent() {
        const { stepIndex, prevStep, nextStep } = useContext(WizardContext);
        return (
          <>
            <div data-testid="step-index">{stepIndex}</div>
            <button type="button" data-testid="prev-step" onClick={prevStep} />
            <button type="button" data-testid="next-step" onClick={nextStep} />
          </>
        );
      }

      const user = userEvent.setup();

      render(
        <WizardContextProvider>
          <TestComponent />
        </WizardContextProvider>,
      );

      const stepIndex = screen.getByTestId('step-index');

      const nextStep = screen.getByTestId('next-step');
      for (let i = 0; i < currentStep; i++) await user.click(nextStep);

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
    function TestComponent() {
      const { stepIndex, prevStep } = useContext(WizardContext);
      return (
        <button type="button" onClick={prevStep}>
          {stepIndex}
        </button>
      );
    }

    const user = userEvent.setup();

    render(
      <WizardContextProvider>
        <TestComponent />
      </WizardContextProvider>,
    );

    const button = screen.getByRole('button');
    expect(button.innerHTML).toEqual('0');

    await user.click(button);
    await waitFor(() => expect(button.innerHTML).toEqual('0'));
  });

  it.each([[1], [2], [5], [10]])(
    'should set stepIndex to 0 when reset called (currentStep=%s)',
    async (currentStep: number) => {
      function TestComponent() {
        const { stepIndex, nextStep, reset } = useContext(WizardContext);
        return (
          <>
            <div data-testid="step-index">{stepIndex}</div>
            <button type="button" data-testid="next-step" onClick={nextStep} />
            <button type="button" data-testid="reset" onClick={reset} />
          </>
        );
      }

      const user = userEvent.setup();

      render(
        <WizardContextProvider>
          <TestComponent />
        </WizardContextProvider>,
      );

      const stepIndex = screen.getByTestId('step-index');

      const nextStep = screen.getByTestId('next-step');
      for (let i = 0; i < currentStep; i++) await user.click(nextStep);

      await waitFor(() =>
        expect(stepIndex.innerHTML).toEqual(currentStep.toString()),
      );

      const reset = screen.getByTestId('reset');
      await user.click(reset);

      await waitFor(() => expect(stepIndex.innerHTML).toEqual('0'));
    },
  );
});
