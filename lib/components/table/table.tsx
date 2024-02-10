import styles from './table.module.scss';
import { CSSProperties, PropsWithChildren } from 'react';
import clsx from 'clsx';

/**
 * Props for the {@link Table} component.
 */
export interface TableProps {
  id?: string;
  className?: string;
  numCols: number;
}

/**
 * An HTML `table` component.
 *
 * @param props {@link TableProps}
 * @returns A JSX element.
 */
export function Table({
  id,
  className,
  numCols,
  children,
}: PropsWithChildren<TableProps>) {
  return (
    <table
      id={id}
      className={clsx(styles.table, className)}
      style={{ '--numCols': numCols } as CSSProperties}
    >
      {children}
    </table>
  );
}
