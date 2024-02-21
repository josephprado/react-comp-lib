import { useWizardContext } from '../../lib/components/wizard-context/use-wizard-context';
import { withWizardContext } from '../../lib/components/wizard-context/with-wizard-context';
import { DemoSection } from '../components/demo-section';
import styles from './wizard-context-demo.module.scss';

interface StepProps {
  textInputName: string;
  selectInput: {
    name: string;
    options: string[];
  };
  submit?: boolean;
}

function Step({ textInputName, selectInput, submit }: StepProps) {
  const { values, handleChange, stepIndex, prevStep, nextStep, reset } =
    useWizardContext();

  const textInputValue = values[textInputName] as string;
  const selectInputValue = values[selectInput.name] as string;

  const isIncomplete = !textInputValue?.trim() || !selectInputValue;

  const handleSubmit = () => {
    window.alert(
      Object.entries(values)
        .map(([key, val]) => `${key}: ${val}`)
        .join('\n'),
    );
    reset();
  };

  return (
    <div className={styles.step}>
      <div className={styles.inputContainer}>
        <label htmlFor={textInputName}>
          <span>{textInputName}</span>
          <input
            id={textInputName}
            type="text"
            name={textInputName}
            value={textInputValue ?? ''}
            onChange={(event) =>
              handleChange(textInputName, event.target.value)
            }
          />
        </label>
        <label htmlFor={selectInput.name}>
          <span>{selectInput.name}</span>
          <select
            name={selectInput.name}
            value={selectInputValue ?? ''}
            onChange={(event) =>
              handleChange(selectInput.name, event.target.value)
            }
          >
            <option value="" disabled style={{ display: 'none' }}>
              Select {selectInput.name}
            </option>
            {selectInput.options.map((option, i) => (
              <option key={i} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className={styles.buttonContainer}>
        {stepIndex > 0 && (
          <button
            type="button"
            className={styles.leftButton}
            onClick={prevStep}
          >
            Back
          </button>
        )}
        <button
          type="button"
          className={styles.rightButton}
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
    textInputName: 'Name',
    selectInput: {
      name: 'Department',
      options: [
        'Accounting',
        'Admin',
        'Business Development',
        'Human Resources',
        'IT',
        'Sales',
      ],
    },
  },

  {
    textInputName: 'Phone',
    selectInput: {
      name: 'Type',
      options: ['Home', 'Office', 'Mobile'],
    },
  },
];

function WizardComponent() {
  const { stepIndex } = useWizardContext();

  const steps = STEPS.map((props, i) => (
    <Step {...props} submit={i === STEPS.length - 1} />
  ));

  return (
    <div className={styles.wizardContainer}>
      {steps[stepIndex]}
      <div className={styles.stepCount}>
        Step {stepIndex + 1} of {STEPS.length}
      </div>
    </div>
  );
}
const DemoComponent = withWizardContext(WizardComponent);

export function WizardContextDemo() {
  return (
    <DemoSection title="WIZARD CONTEXT">
      <div className={styles.examples}>
        <DemoComponent />
      </div>
    </DemoSection>
  );
}
