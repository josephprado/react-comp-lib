/**
 * Converts the given date to the format used by HTML date inputs.
 *
 * @param value A Date object or string that parses to a valid date.
 * @throws Error if `value` cannot be parsed to a valid date.
 * @returns The given date in `yyyy-mm-dd` format (local time).
 */
export function formatDateForInput(value: string | Date): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime()))
    throw new Error(`Unable to convert value: ${value} to date.`);

  const yyyy = date.getFullYear();
  const mm = (date.getMonth() + 1).toString().padStart(2, '0');
  const dd = date.getDate().toString().padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}
