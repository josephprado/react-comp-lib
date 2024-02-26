import styles from './styles.module.scss';
import { useState } from 'react';
import {
  useDataEditingContext,
  withDataEditingContext,
} from '../../../lib/main';

const DEPARTMENT_OPTIONS = [
  'Accounting',
  'Admin',
  'Business',
  'HR',
  'IT',
  'Sales',
];

function WrappedComponent() {
  const { editing, updates, handleChange, openEditMode, cancelEditMode } =
    useDataEditingContext();

  const [name, setName] = useState<string>('Joe Schmo');
  const [department, setDepartment] = useState<string>(DEPARTMENT_OPTIONS[0]);

  const handleInputChange = (event: any) => {
    handleChange(event.target.name, event.target.value);
  };

  const handleSave = () => {
    setName(updates.name as string);
    setDepartment(updates.department as string);
    cancelEditMode();
  };

  return (
    <div className={styles.container}>
      <label htmlFor="name-input">
        <span>Name:</span>
        {editing ? (
          <input
            id="name-input"
            name="name"
            type="text"
            value={updates.name as string}
            onChange={handleInputChange}
          />
        ) : (
          name
        )}
      </label>

      <label htmlFor="department-input">
        <span>Department:</span>
        {editing ? (
          <select
            id="department-input"
            name="department"
            value={updates.department as string}
            onChange={handleInputChange}
          >
            {DEPARTMENT_OPTIONS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        ) : (
          department
        )}
      </label>

      <div className={styles.buttonContainer}>
        {editing ? (
          <>
            <button type="button" onClick={cancelEditMode}>
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!(updates.name as string).length}
            >
              Save
            </button>
          </>
        ) : (
          <button
            className={styles.editButton}
            type="button"
            onClick={() => openEditMode({ name, department })}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

export const DataEditingComponent = withDataEditingContext(WrappedComponent);
