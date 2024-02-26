import styles from './modal.module.scss';
import { PropsWithChildren, useEffect } from 'react';
import ReactDOM from 'react-dom';
import clsx from 'clsx';
import { FocusTrap } from './focus-trap';
import { OutsideClickHandler } from '../outside-click-handler/outside-click-handler';

/**
 * Props for the {@link Modal} component.
 */
export interface ModalProps {
  /**
   * An id passed to the component's root container.
   */
  id?: string;

  /**
   * A CSS class name.
   */
  className?: string;

  /**
   * If true, background content will be overlaid with an opaque screen.
   *
   * @default false
   */
  backdrop?: boolean;

  /**
   * If true, background content will be blurred.
   *
   * @default false
   */
  blur?: boolean;

  /**
   * If true, pressing the `Escape` key will close the modal.
   *
   * @default false
   */
  closeOnEscape?: boolean;

  /**
   * If true, clicking outside the modal's child will close the modal.
   *
   * @default false
   */
  closeOnOutsideClick?: boolean;

  /**
   * A function called when the modal is closed.
   */
  onClose: CallableFunction;
}

/**
 * A component that assumes priority by blocking the content behind it.
 *
 * @param props {@link ModalProps}
 * @returns A JSX element.
 */
export function Modal({
  id,
  className,
  backdrop = false,
  blur = false,
  closeOnEscape = false,
  closeOnOutsideClick = false,
  onClose,
  children,
}: PropsWithChildren<ModalProps>) {
  useEffect(() => {
    const handleEscapeKeyPress = (event: any) => {
      if (event.key === 'Escape' && closeOnEscape && onClose) onClose();
    };
    document.addEventListener('keydown', handleEscapeKeyPress);

    return () => document?.removeEventListener('keydown', handleEscapeKeyPress);
  }, [closeOnEscape, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return ReactDOM.createPortal(
    <FocusTrap
      id={id}
      className={clsx(
        styles.modal,
        backdrop && styles.backdrop,
        blur && styles.blur,
      )}
    >
      {closeOnOutsideClick ? (
        <OutsideClickHandler onOutsideClick={onClose} className={className}>
          {children}
        </OutsideClickHandler>
      ) : (
        <div className={className}>{children}</div>
      )}
    </FocusTrap>,
    document.body,
  );
}
