import styles from './styles.module.scss';
import { useState } from 'react';
import { useDataEditing } from '../../../lib/hooks/use-data-editing/use-data-editing';

type User = {
  name: string;
  age: number;
  hobbies: string[];
};

const HOBBY_OPTIONS = [
  'Board Games',
  'Hiking',
  'Photography',
  'Reading',
  'Running',
  'Swimming',
  'Other',
];

export function DataEditingComponent() {
  const { editing, updates, updateValue, openEditMode, cancelEditMode } =
    useDataEditing<User>();

  const [name, setName] = useState<string>('Joe Schmo');
  const [age, setAge] = useState<number>(30);
  const [hobbies, setHobbies] = useState<string[]>([HOBBY_OPTIONS[0]]);

  const handleSave = () => {
    setName(updates.name ?? '');
    setAge(updates.age ?? 0);
    setHobbies(updates.hobbies ?? []);
    cancelEditMode();
  };

  return (
    <div className={styles.container}>
      <label htmlFor="name-input">
        <span>Name:</span>
        {editing ? (
          <input
            id="name-input"
            type="text"
            value={updates.name ?? ''}
            onChange={(event) => updateValue('name', event.target.value)}
          />
        ) : (
          name
        )}
      </label>

      <label htmlFor="age-input">
        <span>Age:</span>
        {editing ? (
          <input
            id="age-input"
            type="number"
            min={0}
            value={updates.age ?? ''}
            onChange={(event) => updateValue('age', +event.target.value)}
          />
        ) : (
          age
        )}
      </label>

      <label htmlFor="hobbies-input">
        <span>Hobbies:</span>
        {editing ? (
          <select
            id="hobbies-input"
            multiple
            value={updates.hobbies ?? []}
            onChange={(event) =>
              updateValue(
                'hobbies',
                [...event.target.selectedOptions].map(({ value }) => value),
              )
            }
          >
            {HOBBY_OPTIONS.map((hobby) => (
              <option key={hobby} value={hobby}>
                {hobby}
              </option>
            ))}
          </select>
        ) : (
          hobbies.join(', ')
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
              disabled={
                !updates.name?.trim().length || !updates.hobbies?.length
              }
            >
              Save
            </button>
          </>
        ) : (
          <button
            className={styles.editButton}
            type="button"
            onClick={() => openEditMode({ name, age, hobbies })}
          >
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
