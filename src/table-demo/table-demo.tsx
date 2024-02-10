import clsx from 'clsx';
import { HeaderCell } from '../../lib/components/table/table-header';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableRow,
  useSorting,
} from '../../lib/main';
import { DemoSection } from '../components/demo-section';
import { ExampleContainer } from '../components/example-container';
import styles from './table-demo.module.scss';

interface Employee {
  name: string;
  age: number;
  department: string;
}

const data: Employee[] = [
  {
    name: 'Joe',
    age: 30,
    department: 'Accounting',
  },
  {
    name: 'Bob',
    age: 25,
    department: 'Admin',
  },
  {
    name: 'Kate',
    age: 28,
    department: 'Facilities',
  },
  {
    name: 'Mike',
    age: 34,
    department: 'IT',
  },
  {
    name: 'Jill',
    age: 31,
    department: 'Business',
  },
  {
    name: 'Art',
    age: 22,
    department: 'Sales',
  },
  {
    name: 'Jane',
    age: 25,
    department: 'Sales',
  },
  {
    name: 'Sam',
    age: 41,
    department: 'Marketing',
  },
  {
    name: 'Eve',
    age: 29,
    department: 'Business Development',
  },
  {
    name: 'Gail',
    age: 34,
    department: 'Admin',
  },
];

const headers: HeaderCell<Employee>[] = [
  {
    content: 'Name',
    key: 'name',
  },
  {
    content: 'Age',
    key: 'age',
  },
  {
    content: 'Department',
    key: 'department',
  },
];

export function TableDemo() {
  const [sortableKey, sortableDir, sortableFn, sortableData] = useSorting(
    data,
    'name',
    'up',
  );

  return (
    <DemoSection title="TABLE">
      <div className={styles.examples}>
        <ExampleContainer title="Sortable Table">
          <Table numCols={3} className={styles.table}>
            <TableHeader<Employee>
              className={clsx(styles.tableHeader, styles.sortableTableHeader)}
              cells={headers}
              sortKey={sortableKey}
              sortDir={sortableDir}
              sortFn={sortableFn}
            />
            <TableBody>
              {sortableData.map(({ name, age, department }) => (
                <TableRow
                  key={name}
                  className={styles.tableRow}
                  cells={[name, age, department]}
                />
              ))}
            </TableBody>
          </Table>
        </ExampleContainer>

        <ExampleContainer title="Scrollable Table">
          <Table
            numCols={3}
            className={clsx(styles.table, styles.scrollableTable)}
          >
            <TableHeader<Employee>
              className={clsx(styles.tableHeader, styles.scrollableTableHeader)}
              cells={headers}
            />
            <TableBody className={styles.scrollableTableBody}>
              {data.map(({ name, age, department }) => (
                <TableRow
                  key={name}
                  className={styles.tableRow}
                  cells={[name, age, department]}
                />
              ))}
            </TableBody>
          </Table>
        </ExampleContainer>

        <ExampleContainer title="With Footer">
          <Table numCols={3} className={styles.table}>
            <TableHeader<Employee>
              className={styles.tableHeader}
              cells={headers}
            />
            <TableBody>
              {data.map(({ name, age, department }) => (
                <TableRow
                  key={name}
                  className={styles.tableRow}
                  cells={[name, age, department]}
                />
              ))}
            </TableBody>
            <TableFooter
              className={styles.tableFooter}
              cells={[`# Employees: ${data.length}`]}
            />
          </Table>
        </ExampleContainer>
      </div>
    </DemoSection>
  );
}
