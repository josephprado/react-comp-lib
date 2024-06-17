import styles from './styles.module.scss';
import { useState } from 'react';
import { useDebounce } from '../../../lib/main';

export function UseDebounce() {
  const [value, setValue] = useState<string>('');
  const [delay, setDelay] = useState<number>(1000);
  const debouncedValue = useDebounce<string>(value, delay);

  return (
    <div id={styles.container}>
      <div>
        Value should update after{' '}
        <select
          value={delay}
          onChange={(event) => setDelay(+event.target.value)}
        >
          <option value={0}>0s</option>
          <option value={500}>0.5s</option>
          <option value={1000}>1s</option>
          <option value={5000}>5s</option>
        </select>
      </div>
      <input
        type="text"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <div>Value: {debouncedValue}</div>
    </div>
  );
}
