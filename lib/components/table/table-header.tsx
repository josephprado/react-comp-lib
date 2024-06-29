import styles from './table.module.scss';
import { ReactNode } from 'react';
import clsx from 'clsx';
import type {
  SortDir,
  SortFn,
  SortKey,
} from '../../hooks/use-sorting/use-sorting';

/**
 * Props for a cell in the {@link TableHeader} component.
 */
export interface HeaderCell<T> {
  content: ReactNode;
  key?: SortKey<T>;
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
  sortFn?: SortFn<T>;
  collapseCarets?: boolean;
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
  collapseCarets = false,
}: TableHeaderProps<T>) {
  return (
    <thead id={id} className={clsx(styles.tableHeader, className)}>
      <tr className={styles.tableHeaderTr}>
        {cells.map(({ content, key }, i) => {
          const sortable = key != null && !!sortFn;
          const active = sortKey === key;
          return (
            <th
              key={i}
              className={sortable ? styles.sortable : undefined}
              onClick={sortable ? () => sortFn(key) : undefined}
            >
              {content}
              {sortable && (!collapseCarets || active) && (
                <span
                  className={clsx(
                    styles.tableHeaderCaret,
                    active && sortDir === 'up' && styles.up,
                    active && sortDir === 'down' && styles.down,
                  )}
                >
                  {sortDir === 'up' ? '▴' : '▾'}
                </span>
              )}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
