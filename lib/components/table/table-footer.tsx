import styles from './table.module.scss';
import { ReactNode } from 'react';
import clsx from 'clsx';

/**
 * Props for the {@link TableFooter} component.
 */
export interface TableFooterProps {
  id?: string;
  className?: string;
  cells: ReactNode[];
}

/**
 * The footer of a table.
 *
 * @param props {@link TableFooterProps}
 * @returns A JSX element.
 */
export function TableFooter({ id, className, cells }: TableFooterProps) {
  return (
    <tfoot id={id} className={clsx(styles.tableFooter, className)}>
      <tr className={styles.tableFooterTr}>
        {cells.map((cell, i) => (
          <td key={i} className={styles.tableFooterTd}>
            {cell}
          </td>
        ))}
      </tr>
    </tfoot>
  );
}
