import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PropsWithChildren } from 'react';
import { KeyValue } from '../data-editing-context/data-editing-context-provider';
import { useWizardContext } from './use-wizard-context';
import { WizardContextType } from './wizard-context-provider';
import { withWizardContext } from './with-wizard-context';

let mockValues: KeyValue;
let mockStepIndex: number;
const mockHandleChange = vi.fn();
const mockPrevStep = vi.fn();
const mockNextStep = vi.fn();
const mockReset = vi.fn();

vi.mock('./use-wizard-context', () => ({
  useWizardContext: (): WizardContextType => ({
    values: mockValues,
    handleChange: mockHandleChange,
    stepIndex: mockStepIndex,
    prevStep: mockPrevStep,
    nextStep: mockNextStep,
    reset: mockReset,
  }),
}));

describe(withWizardContext.name, () => {
  beforeEach(() => {
    mockValues = { foo: 'bar' };
    mockStepIndex = -1;
  });

  it('should render the children', () => {
    const childText = 'Hello';

    const TestComponent = withWizardContext(function ({
      children,
    }: PropsWithChildren) {
      return <>{children}</>;
    });

    render(
      <TestComponent>
        <div>{childText}</div>
      </TestComponent>,
    );

    const child = screen.getByText(childText);
    expect(child).toBeInTheDocument();
  });

  it('should provide access to the values state', () => {
    mockValues = { foo: 'bar' };

    const combineUpdatesIntoList = (updates: KeyValue) => {
      return Object.entries(updates)
        .map(([k, v]) => `${k}:${v as string}`)
        .join(';');
    };

    const TestComponent = withWizardContext(function () {
      const { values } = useWizardContext();
      return <div data-testid="values">{combineUpdatesIntoList(values)}</div>;
    });

    render(<TestComponent />);

    const values = screen.getByTestId('values').innerHTML;
    expect(values).toEqual(combineUpdatesIntoList(mockValues));
  });

  it('should provide access to the handleChange function', async () => {
    const TestComponent = withWizardContext(function () {
      const { handleChange } = useWizardContext();
      return <button type="button" onClick={() => handleChange('x', 'y')} />;
    });

    const user = userEvent.setup();

    render(<TestComponent />);

    const button = screen.getByRole('button');
    await user.click(button);
    await waitFor(() => expect(mockHandleChange).toHaveBeenCalledOnce());
  });

  it('should provide access to the stepIndex state', () => {
    mockStepIndex = 42;

    const TestComponent = withWizardContext(function () {
      const { stepIndex } = useWizardContext();
      return <div data-testid="step-index">{stepIndex}</div>;
    });

    render(<TestComponent />);

    const stepIndex = screen.getByTestId('step-index').innerHTML;
    expect(stepIndex).toEqual(mockStepIndex.toString());
  });

  it('should provide access to the prevStep function', async () => {
    const TestComponent = withWizardContext(function () {
      const { prevStep } = useWizardContext();
      return <button type="button" onClick={prevStep} />;
    });

    const user = userEvent.setup();

    render(<TestComponent />);

    const button = screen.getByRole('button');
    await user.click(button);
    await waitFor(() => expect(mockPrevStep).toHaveBeenCalledOnce());
  });

  it('should provide access to the nextStep function', async () => {
    const TestComponent = withWizardContext(function () {
      const { nextStep } = useWizardContext();
      return <button type="button" onClick={nextStep} />;
    });

    const user = userEvent.setup();

    render(<TestComponent />);

    const button = screen.getByRole('button');
    await user.click(button);
    await waitFor(() => expect(mockNextStep).toHaveBeenCalledOnce());
  });

  it('should provide access to the reset function', async () => {
    const TestComponent = withWizardContext(function () {
      const { reset } = useWizardContext();
      return <button type="button" onClick={reset} />;
    });

    const user = userEvent.setup();

    render(<TestComponent />);

    const button = screen.getByRole('button');
    await user.click(button);
    await waitFor(() => expect(mockReset).toHaveBeenCalledOnce());
  });
});
