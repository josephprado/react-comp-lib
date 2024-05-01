import { PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from './demo-section.module.scss';

export interface ExampleContainerProps {
  title: string;
  id?: string;
  className?: string;
}

export function ExampleContainer({
  title,
  id,
  className,
  children,
}: PropsWithChildren<ExampleContainerProps>) {
  return (
    <div id={id} className={clsx(styles.exampleContainer, className)}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}
