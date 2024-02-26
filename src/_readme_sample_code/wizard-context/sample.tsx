import styles from './styles.module.scss';
import { useWizardContext, withWizardContext } from '../../../lib/main';

interface StepProps {
  inputs: {
    name: string;
    options?: string[];
  }[];
  submit?: boolean;
}

function Step({ inputs, submit }: StepProps) {
  const { values, handleChange, stepIndex, prevStep, nextStep, reset } =
    useWizardContext();

  const isIncomplete = inputs.some(({ name }) => !values[name]);

  const handleValueChange = (event: any) => {
    handleChange(event.target.name, event.target.value);
  };

  const handleSubmit = () => {
    window.alert(
      Object.entries(values)
        .map(([name, value]) => `${name}: ${value}`)
        .join('\n'),
    );
    reset();
  };

  return (
    <div className={styles.step}>
      {inputs.map(({ name, options }) => (
        <label key={name} htmlFor={name}>
          <span>{name}:</span>
          {options ? (
            <select
              id={name}
              name={name}
              value={(values[name] as string) ?? ''}
              onChange={handleValueChange}
            >
              <option value="" disabled style={{ display: 'none' }}>
                Select {name}
              </option>
              {options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={name}
              name={name}
              type="text"
              value={(values[name] as string) ?? ''}
              onChange={handleValueChange}
            />
          )}
        </label>
      ))}
      <div className={styles.buttonContainer}>
        {stepIndex > 0 && (
          <button type="button" onClick={prevStep}>
            Back
          </button>
        )}
        <button
          type="button"
          onClick={submit ? handleSubmit : nextStep}
          disabled={isIncomplete}
        >
          {submit ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
}

const STEPS: StepProps[] = [
  {
    inputs: [
      { name: 'Name' },
      {
        name: 'Department',
        options: ['Accounting', 'Admin', 'Business', 'HR', 'IT', 'Sales'],
      },
    ],
  },
  {
    inputs: [
      { name: 'Phone' },
      {
        name: 'Type',
        options: ['Home', 'Office', 'Mobile'],
      },
    ],
  },
];

function WrappedComponent() {
  const { stepIndex } = useWizardContext();

  const steps = STEPS.map((props, i) => (
    <Step {...props} submit={i === STEPS.length - 1} />
  ));

  return (
    <div className={styles.container}>
      {steps[stepIndex]}
      <div className={styles.stepCount}>
        Step {stepIndex + 1} of {STEPS.length}
      </div>
    </div>
  );
}

export const WizardComponent = withWizardContext(WrappedComponent);
