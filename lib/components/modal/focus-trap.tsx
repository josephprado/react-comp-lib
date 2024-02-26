import { PropsWithChildren, useEffect, useRef } from 'react';

/**
 * Props for the {@link FocusTrap} component.
 */
export interface FocusTrapProps {
  /**
   * An id passed to the component's root container.
   */
  id?: string;

  /**
   * A CSS class name.
   */
  className?: string;
}

/**
 * Traps focus inside the child element. Tabbing through the focusable elements
 * inside the child will loop in a cycle.
 *
 * @param props {@link FocusTrapProps}
 * @returns A JSX element.
 */
export function FocusTrap({
  id,
  className,
  children,
}: PropsWithChildren<FocusTrapProps>) {
  const ref = useRef<HTMLDivElement>(null);

  // Modified from https://medium.com/cstech/achieving-focus-trapping-in-a-react-modal-component-3f28f596f35b#:~:text=Focus%20trapping%20is%20achieved%20by,to%20navigate%20through%20interactive%20elements.
  useEffect(() => {
    let firstEl: HTMLElement;
    let lastEl: HTMLElement;

    const handleTabKeyPress = (event: any) => {
      if (event.key === 'Tab') {
        if (
          event.shiftKey &&
          (document.activeElement === firstEl ||
            document.activeElement === trap)
        ) {
          event.preventDefault();
          lastEl.focus();
        } else if (!event.shiftKey && document.activeElement === lastEl) {
          event.preventDefault();
          firstEl.focus();
        }
      }
    };

    const trap = ref.current;

    if (trap) {
      trap.focus();

      const tabbableEls = [
        ...trap.querySelectorAll(
          `
          [href],
          button,
          input,
          textarea,
          select,
          summary,
          iframe,
          [tabindex]:not([tabindex="-1"])
          `,
        ),
      ].filter(
        (el) => !el.hasAttribute('disabled') && !el.hasAttribute('aria-hidden'),
      );

      firstEl = tabbableEls[0] as HTMLElement;
      lastEl = tabbableEls[tabbableEls.length - 1] as HTMLElement;

      trap.addEventListener('keydown', handleTabKeyPress);
    }

    return () => trap?.removeEventListener('keydown', handleTabKeyPress);
  }, []);

  return (
    <div id={id} className={className} ref={ref} tabIndex={-1}>
      {children}
    </div>
  );
}
