import styles from './table.module.scss';
import { ReactNode } from 'react';
import clsx from 'clsx';

/**
 * Props for the {@link TableRow} component.
 */
export type TableRowProps = {
  id?: string | number;
  className?: string;
  onRowClick?: (event: any, key?: string | number) => void;
} & (
  | {
      cells: ReactNode[];
      children?: never;
    }
  | {
      children: ReactNode;
      cells?: never;
    }
);

/**
 * A row of a table. Accepts either
 *
 * - `cells`: an array of nodes. Each item  will be automatically wrapped in a `<td>`.
 * - `children`: rendered as is. Direct children must be wrapped in a `<td>`.
 *
 * @param props {@link TableRowProps}
 * @returns A JSX element.
 */
export function TableRow({
  id,
  className,
  onRowClick,
  cells,
  children,
}: TableRowProps) {
  return (
    <tr
      id={id?.toString()}
      className={clsx(styles.tableRow, className)}
      onClick={onRowClick ? (event) => onRowClick(event, id) : undefined}
    >
      {cells?.map((content, i) => <td key={i}>{content}</td>) ?? children}
    </tr>
  );
}
