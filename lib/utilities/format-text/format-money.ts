/**
 * Formats a string or number into "money" format, with a thousands separator
 * and rounded to the nearest 2 decimals.
 *
 * @example
 * ```
 * const m1 = formatMoney(1234); // 1,234.00
 * const m2 = formatMoney('1234.567'); // 1,234.57
 * const m3 = formatMoney(''); // 0.00
 * ```
 * @param value The value to format.
 * @throws Error if `value` cannot be parsed into a valid number.
 * @returns A string formatted as money.
 */
export function formatMoney(value: string | number): string {
  const num = Number(value);

  if (Number.isNaN(num))
    throw new Error(`Unable to convert value: ${value} to number.`);

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}
