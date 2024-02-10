import styles from './button.module.scss';
import { CSSProperties, MouseEventHandler, ReactNode } from 'react';
import clsx from 'clsx';

/**
 * Props for the {@link Button} component.
 */
export interface ButtonProps {
  children: ReactNode;
  id?: string;
  className?: string;
  type?: 'button' | 'submit';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  title?: string;
  style?: CSSProperties;
}

/**
 * A button.
 *
 * @param props {@link ButtonProps}
 * @returns A JSX element.
 */
export function Button({
  children,
  id,
  className,
  type = 'button',
  onClick,
  disabled = false,
  title,
  style,
}: ButtonProps) {
  return (
    <button
      id={id}
      className={clsx(styles.button, className)}
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={style}
    >
      {children}
    </button>
  );
}
