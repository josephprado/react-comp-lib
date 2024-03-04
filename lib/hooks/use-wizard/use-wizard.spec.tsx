import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useWizard } from './use-wizard';

type Thing = {
  foo: string;
  bar: number;
  baz: boolean;
};

function listValues(values: Partial<Thing>) {
  return Object.entries(values)
    .map(([k, v]) => `${k}:${v as string}`)
    .join(';');
}

describe(useWizard.name, () => {
  it('should initialize values to an empty object', () => {
    function TestComponent() {
      const { values } = useWizard<Thing>();
      return <div data-testid="values">{listValues(values)}</div>;
    }

    render(<TestComponent />);

    const values = screen.getByTestId('values');
    expect(values.innerHTML).toEqual(listValues({}));
  });

  it('should update the named value when setValue called', async () => {
    function TestComponent() {
      const { values, setValue } = useWizard<Thing>();
      return (
        <button onClick={() => setValue('foo', 'bar')}>
          {listValues(values)}
        </button>
      );
    }

    const user = userEvent.setup();

    render(<TestComponent />);

    const button = screen.getByRole('button');
    expect(button.innerHTML).toEqual(listValues({}));

    await user.click(button);
    await waitFor(() =>
      expect(button.innerHTML).toEqual(listValues({ foo: 'bar' })),
    );
  });

  it('should initialize stepIndex to 0', () => {
    function TestComponent() {
      const { stepIndex } = useWizard();
      return <div data-testid="step-index">{stepIndex}</div>;
    }

    render(<TestComponent />);

    const stepIndex = screen.getByTestId('step-index').innerHTML;
    expect(stepIndex).toEqual('0');
  });

  it.each([[1], [2], [5], [10]])(
    'should increment stepIndex by one when nextStep called (n=%s)',
    async (n: number) => {
      function TestComponent() {
        const { stepIndex, nextStep } = useWizard();
        return <button onClick={nextStep}>{stepIndex}</button>;
      }

      const user = userEvent.setup();

      render(<TestComponent />);

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
        const { stepIndex, prevStep, nextStep } = useWizard();
        return (
          <>
            <div data-testid="step-index">{stepIndex}</div>
            <button data-testid="prev-step" onClick={prevStep} />
            <button data-testid="next-step" onClick={nextStep} />
          </>
        );
      }

      const user = userEvent.setup();

      render(<TestComponent />);

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
      const { stepIndex, prevStep } = useWizard();
      return <button onClick={prevStep}>{stepIndex}</button>;
    }

    const user = userEvent.setup();

    render(<TestComponent />);

    const button = screen.getByRole('button');
    expect(button.innerHTML).toEqual('0');

    await user.click(button);
    await waitFor(() => expect(button.innerHTML).toEqual('0'));
  });

  it.each([[1], [2], [5], [10]])(
    'should set stepIndex to 0 when reset called (currentStep=%s)',
    async (currentStep: number) => {
      function TestComponent() {
        const { stepIndex, nextStep, reset } = useWizard();
        return (
          <>
            <div data-testid="step-index">{stepIndex}</div>
            <button data-testid="next-step" onClick={nextStep} />
            <button data-testid="reset" onClick={reset} />
          </>
        );
      }

      const user = userEvent.setup();

      render(<TestComponent />);

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

  it('should clear values when reset is called', async () => {
    function TestComponent() {
      const { values, setValue, reset } = useWizard<Thing>();
      return (
        <>
          <div data-testid="values">{listValues(values)}</div>
          <button
            data-testid="set-value"
            onClick={() => setValue('foo', 'bar')}
          />
          <button data-testid="reset" onClick={() => reset()} />
        </>
      );
    }

    const user = userEvent.setup();

    render(<TestComponent />);

    const values = screen.getByTestId('values');

    const setValue = screen.getByTestId('set-value');
    await user.click(setValue);
    await waitFor(() =>
      expect(values.innerHTML).toEqual(listValues({ foo: 'bar' })),
    );

    const reset = screen.getByTestId('reset');
    await user.click(reset);
    await waitFor(() => expect(values.innerHTML).toEqual(listValues({})));
  });
});
