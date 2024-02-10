import { PropsWithChildren } from 'react';
import styles from './demo-section.module.scss';

export interface DemoSectionProps {
  title: string;
}

export function DemoSection({
  title,
  children,
}: PropsWithChildren<DemoSectionProps>) {
  return (
    <div className={styles.container}>
      <h2>{title}</h2>
      {children}
    </div>
  );
}
