import styles from './table.module.scss';
import { ReactNode } from 'react';
import clsx from 'clsx';

/**
 * Props for the {@link TableRow} component.
 */
export interface TableRowProps {
  id?: string | number;
  className?: string;
  cells: ReactNode[];
  onRowClick?: (event: any, key?: string | number) => void;
}

/**
 * A row of a table.
 *
 * @param props {@link TableRowProps}
 * @returns A JSX element.
 */
export function TableRow({ id, className, cells, onRowClick }: TableRowProps) {
  return (
    <tr
      id={id?.toString()}
      className={clsx(styles.tableRow, className)}
      onClick={onRowClick ? (event) => onRowClick(event, id) : undefined}
    >
      {cells.map((content, i) => (
        <td key={i}>{content}</td>
      ))}
    </tr>
  );
}
