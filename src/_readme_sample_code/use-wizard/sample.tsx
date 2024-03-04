import styles from './styles.module.scss';
import { WizardUtils } from '../../../lib/hooks/use-wizard/use-wizard';
import { useWizard } from '../../../lib/main';

interface StepControlsProps {
  isComplete: boolean;
  handleSubmit?: () => void;
  wizardUtils: Pick<WizardUtils, 'stepIndex' | 'prevStep' | 'nextStep'>;
}

function StepControls({
  isComplete,
  handleSubmit,
  wizardUtils,
}: StepControlsProps) {
  const { stepIndex, prevStep, nextStep } = wizardUtils;
  return (
    <div className={styles.buttonContainer}>
      {stepIndex > 0 && (
        <button type="button" onClick={prevStep}>
          Back
        </button>
      )}
      <button
        type="button"
        onClick={handleSubmit ?? nextStep}
        disabled={!isComplete}
      >
        {handleSubmit ? 'Submit' : 'Next'}
      </button>
    </div>
  );
}

interface StepProps<T extends object> {
  wizardUtils: Pick<
    WizardUtils<T>,
    'values' | 'setValue' | 'stepIndex' | 'prevStep' | 'nextStep'
  >;
}

type Employee = {
  name: string;
  department: string;
  phone: string;
  phoneType: string;
};

function Step1({
  wizardUtils,
}: StepProps<Pick<Employee, 'name' | 'department'>>) {
  const { values, setValue, ...rest } = wizardUtils;
  const isComplete = !!values.name?.trim() && !!values.department;

  return (
    <div className={styles.step}>
      <label htmlFor="name">
        <span>Name:</span>
        <input
          id="name"
          type="text"
          value={values.name ?? ''}
          onChange={(event) => setValue('name', event.target.value)}
        />
      </label>
      <label htmlFor="department">
        <span>Department:</span>
        <select
          id="department"
          value={values.department ?? ''}
          onChange={(event) => setValue('department', event.target.value)}
        >
          <option value="" disabled style={{ display: 'none' }}>
            Select Department
          </option>
          {['Accounting', 'Admin', 'Business', 'HR', 'IT', 'Sales'].map(
            (opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ),
          )}
        </select>
      </label>
      <StepControls isComplete={isComplete} wizardUtils={rest} />
    </div>
  );
}

function Step2({
  wizardUtils,
  handleSubmit,
}: StepProps<Pick<Employee, 'phone' | 'phoneType'>> & {
  handleSubmit: () => void;
}) {
  const { values, setValue, ...rest } = wizardUtils;
  const isComplete = !!values.phone?.trim() && !!values.phoneType;

  return (
    <div className={styles.step}>
      <label htmlFor="phone">
        <span>Phone:</span>
        <input
          id="phone"
          type="tel"
          value={values.phone ?? ''}
          onChange={(event) => setValue('phone', event.target.value)}
        />
      </label>
      <label htmlFor="phoneType">
        <span>Type:</span>
        <select
          id="phoneType"
          value={values.phoneType ?? ''}
          onChange={(event) => setValue('phoneType', event.target.value)}
        >
          <option value="" disabled style={{ display: 'none' }}>
            Select Type
          </option>
          {['Home', 'Office', 'Mobile'].map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
      <StepControls
        isComplete={isComplete}
        handleSubmit={handleSubmit}
        wizardUtils={rest}
      />
    </div>
  );
}

export function WizardComponent() {
  const wizardUtils = useWizard<Employee>();

  const handleSubmit = () => {
    window.alert(
      Object.entries(wizardUtils.values)
        .map(([name, value]) => `${name}: ${value}`)
        .join('\n'),
    );
    wizardUtils.reset();
  };

  const steps = [
    <Step1 wizardUtils={wizardUtils} />,
    <Step2 wizardUtils={wizardUtils} handleSubmit={handleSubmit} />,
  ];

  return (
    <div className={styles.container}>
      {steps[wizardUtils.stepIndex]}
      <div className={styles.stepCount}>
        Step {wizardUtils.stepIndex + 1} of {steps.length}
      </div>
    </div>
  );
}
