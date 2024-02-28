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
   * A CSS class name applied to the element that wraps the children of the
   * modal. To apply styles to the modal backdrop, use the `backdrop` prop.
   */
  className?: string;

  /**
   * If true, background content will be overlaid with an opaque screen. If a
   * string, a CSS class name will be placed on the backdrop element for custom
   * styling. Note that the backdrop element is a parent of the element that
   * receives the `className` prop, so if nesting styles, the backdrop class
   * must be the parent. See example.
   *
   * @default false
   * @example
   * ```js
   * <Modal className="myClassName" backdrop="myBackdrop" onClose={handleClose}>
   *   <ModalDialogComponent />
   * </Modal>
   * ```
   * ```scss
   *
   * // Correct
   * .myBackdrop {
   *   background-color: gray;
   *
   *   .myClassName {
   *     height: 256px;
   *   }
   * }
   *
   * // Incorrect
   * .myClassName {
   *   height: 256px;
   *
   *   .myBackdrop {
   *     background-color: gray;
   *   }
   * }
   * ```
   */
  backdrop?: boolean | string;

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
        backdrop === true ? styles.backdrop : backdrop,
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
