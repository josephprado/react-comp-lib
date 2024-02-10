import styles from './table.module.scss';
import { ReactNode } from 'react';
import clsx from 'clsx';
import { SortDir, SortKey } from './use-sorting';

/**
 * Props for a cell in the {@link TableHeader} component.
 */
export interface HeaderCell<T> {
  content: ReactNode;
  key?: keyof T;
}

/**
 * Props for the {@link TableHeader} component.
 */
export interface TableHeaderProps<T> {
  id?: string;
  className?: string;
  cells: HeaderCell<T>[];
  sortKey?: SortKey<T>;
  sortDir?: SortDir;
  sortFn?: (sortKey: SortKey<T>) => void;
}

/**
 * The header of a table. If sorting is needed, include the `sortKey`,
 * `sortDir`, and `sortFn` (provided by the `useSorting` hook) as props.
 * Omit the `key` prop in `cells` for columns that should not be sortable.
 *
 * @param props {@link TableHeaderProps}
 * @returns A JSX element.
 */
export function TableHeader<T>({
  id,
  className,
  cells,
  sortKey,
  sortDir,
  sortFn,
}: TableHeaderProps<T>) {
  return (
    <thead id={id} className={clsx(styles.tableHeader, className)}>
      <tr className={styles.tableHeaderTr}>
        {cells.map(({ content, key }, i) => {
          const sortable = key && sortFn;
          return (
            <th
              key={i}
              className={sortable && styles.sortable}
              onClick={sortable ? () => sortFn(key) : undefined}
            >
              {content}
              {sortable && (
                <span
                  className={clsx(
                    styles.tableHeaderCaret,
                    sortKey === key && sortDir === 'up' && styles.up,
                    sortKey === key && sortDir === 'down' && styles.down,
                  )}
                >
                  {sortDir === 'up' ? '▲' : '▼'}
                </span>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
