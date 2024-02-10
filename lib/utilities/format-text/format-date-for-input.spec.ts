import { describe, expect, it } from 'vitest';
import { formatDateForInput } from './format-date-for-input';

describe(formatDateForInput.name, () => {
  it.each([
    ['1/2/23', '2023-01-02'],
    ['01/02/23', '2023-01-02'],
    ['1/2/2023', '2023-01-02'],
    ['01/02/2023', '2023-01-02'],

    ['1/22/23', '2023-01-22'],
    ['01/22/23', '2023-01-22'],
    ['1/22/2023', '2023-01-22'],
    ['01/22/2023', '2023-01-22'],

    ['12/2/23', '2023-12-02'],
    ['12/02/23', '2023-12-02'],
    ['12/2/2023', '2023-12-02'],
    ['12/02/2023', '2023-12-02'],

    [new Date('1/2/23'), '2023-01-02'],
    [new Date('01/02/23'), '2023-01-02'],
    [new Date('1/2/2023'), '2023-01-02'],
    [new Date('01/02/2023'), '2023-01-02'],

    [new Date('1/22/23'), '2023-01-22'],
    [new Date('01/22/23'), '2023-01-22'],
    [new Date('1/22/2023'), '2023-01-22'],
    [new Date('01/22/2023'), '2023-01-22'],

    [new Date('12/2/23'), '2023-12-02'],
    [new Date('12/02/23'), '2023-12-02'],
    [new Date('12/2/2023'), '2023-12-02'],
    [new Date('12/02/2023'), '2023-12-02'],

    // These will fail because of time zone differences
    // ['2023-12-02T00:00:00Z', '2023-12-02'],
    // ['2023-12-02', '2023-12-02'],
  ])(
    'should convert a value as expected (value=%s)',
    (value: string | Date, expected: string) => {
      const actual = formatDateForInput(value);
      expect(actual).toEqual(expected);
    },
  );

  it.each([
    [''],
    [' '],
    ['foo'],
    ['13/1/23'],
    ['13/01/23'],
    ['13/1/2023'],
    ['13/01/2023'],
    ['12/32/23'],
    ['12/32/2023'],
    ['2023-13-01'],
    ['2023-12-32'],
  ])(
    'should throw an error if value cannot be parsed to a date (value=%s)',
    async (value: string) => {
      expect(() => formatDateForInput(value)).toThrowError(
        /Unable to convert value:/,
      );
    },
  );
});
