/**
 * Joins a list of strings or numbers into a single comma-separated string,
 * terminated with a period. For lists of size 2, the comma is omitted.
 *
 * @example
 * ```
 * const list1 = ['foo', 'bar'];
 * const join1 = joinList(list1); // foo and bar.
 *
 * const list2 = ['foo', 'bar', 'baz'];
 * const join2 = joinList(list2, 'Hello'); // Hello foo, bar, and baz.
 * ```
 *
 * @param list The items to join.
 * @param prefix A string or number prepended to the resulting string.
 * @returns A string representation of the given list.
 */
export function joinList(
  list: Array<string | number>,
  prefix?: string | number,
): string {
  const listStr = list.reduce(
    (acc, curr, i) =>
      i === 0
        ? curr.toString()
        : i === list.length - 1
        ? `${acc}${list.length === 2 ? '' : ','} and ${curr}`
        : `${acc}, ${curr}`,
    '',
  ) as string;

  const space = prefix?.toString() && listStr.length ? ' ' : '';
  const period = prefix?.toString() || listStr.length ? '.' : '';

  return `${prefix ?? ''}${space}${listStr}${period}`;
}
