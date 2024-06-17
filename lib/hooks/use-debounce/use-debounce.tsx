import { useEffect, useState } from 'react';

/**
 * Creates a debounce effect that delays setting a value.
 *
 * @param value The value being debounced.
 * @param delay The delay in setting the value (in ms). Default 1000.
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 1000) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
}
