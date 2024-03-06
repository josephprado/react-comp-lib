import styles from './styles.module.scss';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableRow,
  useSorting,
} from '../../../lib/main';
import { HeaderCell } from '../../../lib/components/table/table-header';

interface Employee {
  name: string;
  age: number;
  department: string;
}

const data: Employee[] = [
  { name: 'Joe', age: 30, department: 'Accounting' },
  { name: 'Bob', age: 25, department: 'Admin' },
  { name: 'Kate', age: 28, department: 'Facilities' },
  { name: 'Mike', age: 34, department: 'IT' },
  { name: 'Jill', age: 31, department: 'Business' },
  { name: 'Art', age: 22, department: 'Sales' },
  { name: 'Jane', age: 25, department: 'Sales' },
  { name: 'Sam', age: 41, department: 'Marketing' },
  { name: 'Eve', age: 29, department: 'Business Development' },
  { name: 'Gail', age: 34, department: 'Admin' },
];

const headers: HeaderCell<Employee>[] = [
  { content: 'Name', key: 'name' },
  { content: 'Age', key: 'age' },
  { content: 'Department', key: 'department' },
];

export function TableExample() {
  const [sortKey, sortDir, sortFn, sortedData] = useSorting<Employee>(
    data,
    'name',
    'up',
  );
  return (
    <Table numCols={headers.length} className={styles.table}>
      <TableHeader<Employee>
        className={styles.tableHeader}
        cells={headers}
        sortKey={sortKey}
        sortDir={sortDir}
        sortFn={sortFn}
        collapseCarets
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
      <TableFooter
        className={styles.tableFooter}
        cells={[`# Employees: ${data.length}`]}
      />
    </Table>
  );
}
