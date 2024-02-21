import { useState } from 'react';
import { DemoSection } from '../components/demo-section';
import { ExampleContainer } from '../components/example-container';
import { formatTelUSA } from '../../lib/utilities/format-text/format-tel-usa';
import styles from './format-tel-usa-demo.module.scss';

export function FormatTelUSADemo() {
  const [phoneExt, setPhoneExt] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  return (
    <DemoSection title="FORMAT TELEPHONE (USA)">
      <div className={styles.examples}>
        <ExampleContainer title="With Extension">
          <input
            type="tel"
            placeholder="enter digits only"
            value={phoneExt}
            onChange={(event) => setPhoneExt(formatTelUSA(event.target.value))}
          />
        </ExampleContainer>

        <ExampleContainer title="Without Extension">
          <input
            type="tel"
            placeholder="enter digits only"
            value={phone}
            onChange={(event) =>
              setPhone(formatTelUSA(event.target.value, true))
            }
          />
        </ExampleContainer>
      </div>
    </DemoSection>
  );
}
