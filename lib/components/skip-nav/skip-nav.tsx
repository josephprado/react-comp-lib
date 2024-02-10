import styles from './skip-nav.module.scss';

/**
 * Props for the {@link SkipNav} component.
 */
export interface SkipNavProps {
  /**
   * The id of main content of the page. If the skip nav is clicked, focus will be transferred here.
   */
  mainId: string;
}

/**
 * A hidden anchor that links to the main content of the page, for accessibility purposes.
 * The skip nav is the first tabbable link in the page, which allows for bypassing of the
 * entire header content.
 *
 * @param props {@link SkipNavProps}
 * @returns A JSX element.
 */
export function SkipNav({ mainId }: SkipNavProps) {
  return (
    <a id={styles.skipNav} href={'#' + mainId}>
      Skip to main content
    </a>
  );
}
