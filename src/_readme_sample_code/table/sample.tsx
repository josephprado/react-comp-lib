import styles from './styles.module.scss';
import {
  Table,
  TableBody,
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
