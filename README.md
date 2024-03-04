# React Component Library

## Setup

Install the package.

```bash
npm i @portfolijo/react-comp-lib
```

Import the CSS file in your project.

```ts
// index.tsx

import '@portfolijo/react-comp-lib/dist/style.css';
```

## Usage

### useDataEditing\<T\>

Provides utilities for editing data.

#### Values

##### `editing`

True when in the editing state, and false when not.

- type: boolean
- default: false

---

##### `updates`

An object containing updated values of the data.

- type: Partial\<T\>
- default: {}

---

##### `updateValue<K extends keyof T>`

Sets the named property in `updates`.

- Parameters:
  - `name`: K
  - `value`: K[T]

---

##### `openEditMode`

Sets `editing` to true and initializes `updates` with `initUpdates`.

- Parameters:
  - `initUpdates`?: Partial\<T\>

---

##### `cancelEditMode`

Sets `editing` to false and clears `updates`.

---

#### Example

```ts
import styles from './styles.module.scss';
import { useState } from 'react';
import { useDataEditing } from '@portfolijo/react-comp-lib';

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
```

### ExpandingContext

Maintains state and functions used by components that expand and contract.

#### Props

##### `isExpanded`

Sets the initial value of `expanded`.

- type: boolean
- default: false

---

#### Values

##### `expanded`

True when in the expanded state, and false when contracted.

- type: boolean
- default: false

---

##### `setExpanded`

- A set state function for `expanded`.

---

#### Example

```ts
import styles from './styles.module.scss';
import { useExpandingContext, withExpandingContext } from '@portfolijo/react-comp-lib';

function WrappedComponent() {
  const { expanded, setExpanded } = useExpandingContext();
  return (
    <div
      className={styles.container}
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className={styles.alwaysVisible}>
        Click here to {expanded ? 'collapse' : 'expanded'}!
      </div>
      {expanded && (
        <div
          className={styles.sometimesVisible}
          onClick={(event) => event.stopPropagation()}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </div>
      )}
    </div>
  );
}

export const ExpandingComponent = withExpandingContext(WrappedComponent, true);
```

### WizardContext

Maintains state and functions used by step-by-step "wizard" components.

#### Values

##### `values`

An object storing data used by the wizard component.

- type: KeyValue
- default: {}

---

##### `handleChange`

Updates the named property in `values`.

- Parameters:
  - `name`: string
  - `value`: unknown

---

##### `stepIndex`

The index of the currently active step.

- type: number
- default: 0

---

##### `prevStep`

Decrements `stepIndex` by 1 (will not go below 0).

---

##### `nextStep`

Increments `stepIndex` by 1.

---

##### `reset`

Restores the initial state of `values` and `stepIndex`.

---

#### Example

```ts
import styles from './styles.module.scss';
import { useWizardContext, withWizardContext } from '@portfolijo/react-comp-lib';

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
```

### Modal

#### Props

##### `id`

An id passed to the component's root container.

- type: string
- default: undefined

---

##### `className`

A CSS class name applied to the element that wraps the children of the modal. To apply styles to the modal backdrop, use the `backdrop` prop.

- type: string
- default: undefined

---

##### `backdrop`

If true, background content will be overlaid with an opaque screen. If a string, a CSS class name will be placed on the backdrop element for custom styling. Note that the backdrop element is a parent of the element that receives the `className` prop, so if nesting styles, the backdrop class must be the parent.

- type: boolean | string
- default: false

---

##### `closeOnEscape`

If true, pressing the `Escape` key will close the modal.

- type: boolean
- default: false

---

##### `closeOnOutsideClick`

If true, clicking outside the modal's child will close the modal.

- type: boolean
- default: false

---

##### `onClose`

A function called when the modal is closed.

---

#### Example

```ts
import styles from './styles.module.scss';
import { useState } from 'react';
import { Modal } from '@portfolijo/react-comp-lib';

export function ModalExample() {
  const [open, setOpen] = useState<boolean>(false);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <button type="button" onClick={() => setOpen((prev) => !prev)}>
        Open Modal
      </button>
      {open && (
        <Modal
          className={styles.modal}
          backdrop
          closeOnEscape
          closeOnOutsideClick
          onClose={handleClose}
        >
          <div className={styles.modalDialogHeader}>
            Modal Dialog
            <button type="button" onClick={handleClose}>
              X
            </button>
          </div>
          <div className={styles.modalDialogBody}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Quam
            adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus urna.
            Bibendum arcu vitae elementum curabitur vitae nunc sed velit. Non
            pulvinar neque laoreet suspendisse. Consequat mauris nunc congue
            nisi vitae.
          </div>
          <div className={styles.modalDialogControls}>
            <button type="button">Cancel</button>
            <button type="button">Save</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
```

### Table

#### Props

##### Table

##### `id`

An id passed to the component's root container.

- type: string
- default: undefined

---

##### `className`

A CSS class name.

- type: string
- default: undefined

---

##### `numCols`

Specifies the number of columns in that table.

- type: number

---

##### TableHeader

##### `id`

An id passed to the component's root container.

- type: string
- default: undefined

---

##### `className`

A CSS class name.

- type: string
- default: undefined

---

##### `cells`

An array containing the objects in each header cell.

- type: `HeaderCell[]`

---

##### `sortKey`

The key of the currently sorted property.

- type: `SortKey`

---

##### `sortDir`

The direction of the currently sorted property.

- type: `SortDir`

---

##### `sortFn`

Sorts the data by the given sort key.

- Parameters:
  - `sortKey`: The sort key used for ordering.

---

##### `collapseCarets`

By default, the widths of all sortable header cells account for the width of a sorting caret (even when the column is not sorted). This ensures that the column widths remain stable when the sort key changes. Setting this value to true negates that behavior.

- type: boolean
- default: false

---

##### TableBody

##### `id`

An id passed to the component's root container.

- type: string
- default: undefined

---

##### `className`

A CSS class name.

- type: string
- default: undefined

---

##### TableRow

##### `id`

An id passed to the component's root container.

- type: string
- default: undefined

---

##### `className`

A CSS class name.

- type: string
- default: undefined

---

##### `cells`

An array containing the objects in each column cell.

- type: `ReactNode[]`

---

##### `onRowClick`

A function called when the component is clicked.

- Parameters:
  - event: any
  - key?: string | number

---

##### TableFooter

##### `id`

An id passed to the component's root container.

- type: string
- default: undefined

---

##### `className`

A CSS class name.

- type: string
- default: undefined

---

##### `cells`

An array containing the objects in each column cell.

- type: `ReactNode[]`

---

#### Example

```ts
import styles from './styles.module.scss';
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  useSorting,
} from '@portfolijo/react-comp-lib';
import { HeaderCell } from '@portfolijo/react-comp-lib/dist/components/table/table-header';

interface Employee {
  name: string;
  age: number;
  department: string;
}

const data: Employee[] = [
  { name: 'Joe', age: 30, department: 'Accounting' },
  { name: 'Bob', age: 25, department: 'Admin' },
  { name: 'Kate', age: 28, department: 'Business' },
  { name: 'Eve', age: 34, department: 'IT' },
];

const headers: HeaderCell<Employee>[] = [
  { content: 'Name', key: 'name' },
  { content: 'Age', key: 'age' },
  { content: 'Department', key: 'department' },
];

export function TableExample() {
  const [sortKey, sortDir, sortFn, sortedData] = useSorting(data, 'name', 'up');
  return (
    <Table numCols={headers.length} className={styles.table}>
      <TableHeader<Employee>
        className={styles.tableHeader}
        cells={headers}
        sortKey={sortKey}
        sortDir={sortDir}
        sortFn={sortFn}
      />
      <TableBody>
        {sortedData.map(({ name, age, department }) => (
          <TableRow
            key={name}
            className={styles.tableRow}
            cells={[name, age, department]}
          />
        ))}
      </TableBody>
    </Table>
  );
}
```
