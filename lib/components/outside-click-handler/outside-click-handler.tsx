import { PropsWithChildren, useEffect, useRef } from 'react';

/**
 * Props for the {@link OutsideClickHandler} component.
 */
export interface OutsideClickHandlerProps {
  className?: string;
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
  className,
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

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
