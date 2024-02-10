import { PropsWithChildren, useEffect, useRef } from 'react';

/**
 * Props for the {@link OutsideClickHandler} component.
 */
export interface OutsideClickHandlerProps {
  onOutsideClick: CallableFunction;
}

/**
 * Listens for clicks outside the child component, then calls the
 * `onOutsideClick` function.
 *
 * @param props {@link OutsideClickHandlerProps}
 * @returns A JSX element.
 */
export function OutsideClickHandler({
  onOutsideClick,
  children,
}: PropsWithChildren<OutsideClickHandlerProps>) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (!ref.current?.contains(event.target)) onOutsideClick();
    };

    document.addEventListener('click', handleOutsideClick, true);

    return () => {
      document.removeEventListener('click', handleOutsideClick, true);
    };
  }, [onOutsideClick]);

  return <div ref={ref}>{children}</div>;
}
