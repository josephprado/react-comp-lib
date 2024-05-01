import styles from './styles.module.scss';
import { HeaderCell } from '../../../lib/components/table/table-header';
import {
  Filters,
  SetFilter,
  useFiltering,
} from '../../../lib/hooks/use-filtering/use-filtering';
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableRow,
  useSorting,
} from '../../../lib/main';
import { ChangeEvent, useEffect, useState } from 'react';
import { CompareFns } from '../../../lib/hooks/use-sorting/use-sorting';

interface Employee {
  name: { first: string; last: string };
  age: number;
  department: string;
  inactive?: boolean;
}

const HEADERS: HeaderCell<Employee>[] = [
  { content: 'Name', key: 'name' },
  { content: 'Age', key: 'age' },
  { content: 'Department', key: 'department' },
];

const DATA: Employee[] = [
  { name: { first: 'Joe', last: 'Powers' }, age: 30, department: 'Accounting' },
  { name: { first: 'Bob', last: 'Allen' }, age: 25, department: 'Admin' },
  { name: { first: 'Kate', last: 'Boyd' }, age: 28, department: 'Facilities' },
  { name: { first: 'Mike', last: 'Yang' }, age: 34, department: 'IT' },
  { name: { first: 'Jill', last: 'Davis' }, age: 31, department: 'Business' },
  { name: { first: 'Art', last: 'Evans' }, age: 22, department: 'Sales' },
  { name: { first: 'Jane', last: 'Fitzgerald' }, age: 25, department: 'Sales' },
  { name: { first: 'Sam', last: 'Guy' }, age: 41, department: 'Marketing' },
  {
    name: { first: 'Eve', last: 'Hill' },
    age: 29,
    department: 'Business',
    inactive: true,
  },
  {
    name: { first: 'Gail', last: 'Ingram' },
    age: 34,
    department: 'Admin',
    inactive: true,
  },
];

const DEPARTMENT_OPTIONS = [
  ...new Set(DATA.map(({ department }) => department)),
];

const COMPARE_FNS: CompareFns<Employee> = {
  name: (a, b) => {
    if (a.last < b.last) return -1;
    if (a.last > b.last) return 1;
    return 0;
  },
};

interface EmployeeFilter {
  activeEmployees: boolean;
  name: string;
  minimumAge: string;
  departments: string[];
}

export function FilteredTable() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [filters, setFilter, filteredData, clearFilter] = useFiltering<
    Employee,
    EmployeeFilter
  >({ data: loading ? [] : employees });

  useEffect(() => {
    const activeOnly = filters.activeEmployees?.active;
    setLoading(true);

    if (activeOnly != null) {
      setTimeout(() => {
        let data = DATA;

        if (activeOnly) data = data.filter(({ inactive }) => !inactive);

        setEmployees(data);
        setLoading(false);
      }, 1000);
    }
  }, [filters.activeEmployees?.active]);

  return (
    <div id={styles.outerContainer}>
      <div id={styles.activeFilters}>
        Active Filters:
        {Object.entries(filters)
          .filter(([_, { active }]) => active)
          .map(([name, { label, state }]) => (
            <div key={name} className={styles.chip}>
              {label}: {state.toString()}
              <button
                type="button"
                onClick={() => clearFilter(name as keyof EmployeeFilter, true)}
              >
                ×
              </button>
            </div>
          ))}
      </div>
      <div id={styles.filterTableContainer}>
        <EmployeeFilter filters={filters} setFilter={setFilter} />
        <EmployeeTable data={filteredData} loading={loading} />
      </div>
    </div>
  );
}

function EmployeeFilter({
  filters,
  setFilter,
}: {
  filters: Filters<Employee, EmployeeFilter>;
  setFilter: SetFilter<Employee, EmployeeFilter>;
}) {
  // Initialize the filters.
  useEffect(() => {
    setFilter({
      name: 'activeEmployees',
      label: 'Active Employees',
      active: true,
      state: true,
      clearedState: false,
    });

    setFilter({
      name: 'name',
      label: 'Name',
      active: false,
      state: '',
      clearedState: '',
      fn: ({ name: { first, last } }, state) => {
        const regex = new RegExp(
          state.trim().replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'),
          'i',
        );
        return (
          regex.test(`${first} ${last}`) || regex.test(`${last}, ${first}`)
        );
      },
    });

    setFilter({
      name: 'minimumAge',
      label: 'Minimum Age',
      active: false,
      state: '',
      clearedState: '',
      fn: ({ age }, state) => age >= +state,
    });

    setFilter({
      name: 'departments',
      label: 'Departments',
      active: false,
      state: DEPARTMENT_OPTIONS,
      clearedState: DEPARTMENT_OPTIONS,
      fn: ({ department }, state) => state.includes(department),
    });
  }, [setFilter]);

  const handleActiveEmployeesChange = () => {
    const active = !filters.activeEmployees?.active;
    setFilter({
      name: 'activeEmployees',
      active,
      state: active,
    });
  };

  const handleNameLikeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nameLike = event.target.value;
    setFilter({
      name: 'name',
      active: !!nameLike.trim(),
      state: nameLike,
    });
  };

  const handleMinAgeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const minAge = event.target.value.replace(/\D/g, '');
    setFilter({
      name: 'minimumAge',
      active: !!minAge,
      state: minAge,
    });
  };

  const handleDepartmentsChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const departments = [...event.target.selectedOptions].map(
      ({ value }) => value,
    );
    setFilter({
      name: 'departments',
      active: departments.length < DEPARTMENT_OPTIONS.length,
      state: departments,
    });
  };

  return (
    <div className={styles.filters}>
      <div className={styles.filter}>
        <label htmlFor="active-employee-filter-checkbox">
          <input
            type="checkbox"
            id="active-employee-filter-checkbox"
            value=""
            checked={filters.activeEmployees?.active ?? false}
            onChange={handleActiveEmployeesChange}
          />
          Active Employees Only
        </label>
      </div>

      <div className={styles.filter}>
        <label htmlFor="name-like-input">Name</label>
        <input
          id="name-like-input"
          type="text"
          value={filters.name?.state ?? ''}
          onChange={handleNameLikeChange}
        />
      </div>

      <div className={styles.filter}>
        <label htmlFor="min-age-input">Minimum Age</label>
        <input
          id="min-age-input"
          type="text"
          value={filters.minimumAge?.state ?? ''}
          onChange={handleMinAgeChange}
        />
      </div>

      <div className={styles.filter}>
        <label htmlFor="department-select">Departments</label>
        <select
          id="department-select"
          multiple
          value={filters.departments?.state ?? []}
          onChange={handleDepartmentsChange}
        >
          {DEPARTMENT_OPTIONS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function EmployeeTable({
  data,
  loading,
}: {
  data: Employee[];
  loading: boolean;
}) {
  const [sortKey, sortDir, sortFn, sortedData] = useSorting<Employee>({
    data,
    compareFns: COMPARE_FNS,
  });
  return (
    <Table
      numCols={HEADERS.length}
      className={styles.table}
      stableScrollbarGutter
    >
      <TableHeader<Employee>
        className={styles.tableHeader}
        cells={HEADERS}
        sortKey={sortKey}
        sortDir={sortDir}
        sortFn={sortFn}
      />
      <TableBody className={styles.tableBody}>
        {loading ? (
          <TableRow
            className={styles.loadingRow}
            cells={[
              <svg
                className={styles.loadingSpinner}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                />
              </svg>,
            ]}
          />
        ) : (
          sortedData.map(({ name, age, department, inactive }) => (
            <TableRow
              className={styles.tableRow}
              key={name.last}
              cells={[
                <span
                  className={inactive ? styles.inactiveEmployee : undefined}
                >
                  {name.last}, {name.first}
                </span>,
                age,
                department,
              ]}
            />
          ))
        )}
      </TableBody>
      <TableFooter
        className={styles.tableFooter}
        cells={[`# Employees: ${sortedData.length}`]}
      />
    </Table>
  );
}
