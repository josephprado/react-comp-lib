import { useState } from 'react';
import { DemoSection } from '../components/demo-section';
import { SkipNav } from '../../lib/main';
import styles from './skip-nav-demo.module.scss';

export interface SkipNavDemoProps {
  containerId: string;
}

export function SkipNavDemo({ containerId }: SkipNavDemoProps) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <DemoSection title="SKIP NAV">
      <div className={styles.examples}>
        {open && <SkipNav mainId={styles.mainContent} />}
        <div id={styles.mainContent} tabIndex={0} className={styles.focus}>
          Click the button below. Then hit the tab key. A popup should appear
          with the text: 'Skip to main content.' Either press enter or click on
          the popup. Once clicked focus should be transferred to this div
          (indicated by a blue outline).
        </div>
        <div className={styles.buttonContainer}>
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              const container = document.getElementById(
                containerId,
              ) as HTMLElement;
              container.tabIndex = 0;
              container?.focus({ preventScroll: true });
            }}
            tabIndex={-1}
            disabled={open}
          >
            Click Me!
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            tabIndex={-1}
            disabled={!open}
          >
            Reset
          </button>
        </div>
      </div>
    </DemoSection>
  );
}
