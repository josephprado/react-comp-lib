import { useState } from 'react';
import { OutsideClickHandler } from '../../lib/main';
import { DemoSection } from '../components/demo-section';
import styles from './outside-click-handler-demo.module.scss';

export function OutsideClickHandlerDemo() {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <DemoSection title="OUTSIDE CLICK HANDLER">
      <div className={styles.examples}>
        {open ? (
          <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
            <div className={styles.target}>Click outside me to close!</div>
          </OutsideClickHandler>
        ) : (
          <button type="button" onClick={() => setOpen(true)}>
            Click Me!
          </button>
        )}
      </div>
    </DemoSection>
  );
}
