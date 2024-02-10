import { describe, expect, it } from 'vitest';
import { joinList } from './join-list';

describe(joinList.name, () => {
  it.each([
    [[], ''],
    [[1], '1.'],
    [[1, 2], '1 and 2.'],
    [[1, 2, 3], '1, 2, and 3.'],
    [[1, 2, 3, 4], '1, 2, 3, and 4.'],
    [['a'], 'a.'],
    [['a', 'b'], 'a and b.'],
    [['a', 'b', 'c'], 'a, b, and c.'],
    [['a', 'b', 'c', 'd'], 'a, b, c, and d.'],
    [[1, 'a'], '1 and a.'],
    [['a', 1], 'a and 1.'],
    [[1, 'a', 1], '1, a, and 1.'],
    [['a', 1, 'a'], 'a, 1, and a.'],
  ])(
    'should join a list as expected (list=%s)',
    (list: Array<string | number>, expected: string) => {
      const joined = joinList(list);
      expect(joined).toEqual(expected);
    },
  );

  it.each([
    [[], '', ''],
    [[], undefined, ''],
    [[], 1, '1.'],
    [[], 'a', 'a.'],
    [[1], '', '1.'],
    [[1], undefined, '1.'],
    [[1], 1, '1 1.'],
    [[1], 'a', 'a 1.'],
    [[1, 2], '', '1 and 2.'],
    [[1, 2], undefined, '1 and 2.'],
    [[1, 2], 1, '1 1 and 2.'],
    [[1, 2], 'a', 'a 1 and 2.'],
    [['a'], '', 'a.'],
    [['a'], undefined, 'a.'],
    [['a'], 1, '1 a.'],
    [['a'], 'a', 'a a.'],
    [['a', 1], '', 'a and 1.'],
    [['a', 1], undefined, 'a and 1.'],
    [['a', 1], 1, '1 a and 1.'],
    [['a', 1], 'a', 'a a and 1.'],
  ])(
    'should prepend the given prefix to the list (list=%s, prefix=%s)',
    (
      list: Array<string | number>,
      prefix: string | number | undefined,
      expected: string,
    ) => {
      const joined = joinList(list, prefix);
      expect(joined).toEqual(expected);
    },
  );
});
