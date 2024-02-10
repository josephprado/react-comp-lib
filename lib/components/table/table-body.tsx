import styles from './table.module.scss';
import { PropsWithChildren } from 'react';
import clsx from 'clsx';

/**
 * Props for the {@link TableBody} component.
 */
export interface TableBodyProps {
  id?: string;
  className?: string;
}

/**
 * The body of a table.
 *
 * @param props {@link TableBodyProps}
 * @returns A JSX element.
 */
export function TableBody({
  id,
  className,
  children,
}: PropsWithChildren<TableBodyProps>) {
  return (
    <tbody id={id} className={clsx(styles.tableBody, className)}>
      {children}
    </tbody>
  );
}
