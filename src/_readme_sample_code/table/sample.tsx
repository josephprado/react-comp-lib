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
import { CompareFns } from '../../../lib/components/table/use-sorting';

interface Employee {
  name: { first: string; last: string };
  age: number;
  department: string;
}

const data: Employee[] = [
  { name: { first: 'Joe', last: 'Powers' }, age: 30, department: 'Accounting' },
  { name: { first: 'Bob', last: 'Allen' }, age: 25, department: 'Admin' },
  { name: { first: 'Kate', last: 'Boyd' }, age: 28, department: 'Facilities' },
  { name: { first: 'Mike', last: 'Carlson' }, age: 34, department: 'IT' },
  { name: { first: 'Jill', last: 'Davis' }, age: 31, department: 'Business' },
  { name: { first: 'Art', last: 'Evans' }, age: 22, department: 'Sales' },
  { name: { first: 'Jane', last: 'Fitzgerald' }, age: 25, department: 'Sales' },
  { name: { first: 'Sam', last: 'Guy' }, age: 41, department: 'Marketing' },
  { name: { first: 'Eve', last: 'Hill' }, age: 29, department: 'Business' },
  { name: { first: 'Gail', last: 'Ingram' }, age: 34, department: 'Admin' },
];

const compareFns: CompareFns<Employee> = {
  name: (a, b) => {
    if (a.last < b.last) return -1;
    if (a.last > b.last) return 1;
    return 0;
  },
};

const headers: HeaderCell<Employee>[] = [
  { content: 'Name', key: 'name' },
  { content: 'Age', key: 'age' },
  { content: 'Department', key: 'department' },
];

export function TableExample() {
  const [sortKey, sortDir, sortFn, sortedData] = useSorting<Employee>({
    data,
    defaultSortKey: 'name',
    defaultSortDir: 'up',
    compareFns,
  });
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
            key={name.last}
            className={styles.tableRow}
            cells={[`${name.last}, ${name.first}`, age, department]}
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
