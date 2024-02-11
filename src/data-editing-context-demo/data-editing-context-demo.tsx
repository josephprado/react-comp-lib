import { useState } from 'react';
import { useDataEditingContext } from '../../lib/components/data-editing/use-data-editing-context';
import { withDataEditingContext } from '../../lib/components/data-editing/with-data-editing-context';
import { DemoSection } from '../components/demo-section';
import styles from './data-editing-context-demo.module.scss';

function DataEditingComponent() {
  const { editing, updates, handleChange, openEditMode, cancelEditMode } =
    useDataEditingContext();
  const [username, setUsername] = useState<string>('joe_schmo');
  const [email, setEmail] = useState<string>('joe@schmo.com');

  return (
    <div className={styles.container}>
      <div className={styles.editForm}>
        <div className={styles.inputWrapper}>
          <span className={styles.inputTitle}>Username:</span>
          {editing ? (
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={updates.username as string}
              onChange={(event) => handleChange('username', event.target.value)}
            />
          ) : (
            username
          )}
        </div>
        <div className={styles.inputWrapper}>
          <span className={styles.inputTitle}>Email:</span>
          {editing ? (
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={updates.email as string}
              onChange={(event) => handleChange('email', event.target.value)}
            />
          ) : (
            email
          )}
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            disabled={editing}
            onClick={() => openEditMode({ username, email })}
          >
            Edit
          </button>
          <button
            type="button"
            disabled={!editing}
            onClick={() => {
              setUsername(updates.username as string);
              setEmail(updates.email as string);
              cancelEditMode();
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
const DemoComponent = withDataEditingContext(DataEditingComponent);

export function DataEditingContextDemo() {
  return (
    <DemoSection title="DATA EDITING CONTEXT">
      <div className={styles.examples}>
        <DemoComponent />
      </div>
    </DemoSection>
  );
}
