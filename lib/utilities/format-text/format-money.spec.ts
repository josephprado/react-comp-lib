import { describe, expect, it } from 'vitest';
import { formatMoney } from './format-money';

describe(formatMoney.name, () => {
  it.each([
    [0, '0.00'],
    [0.0, '0.00'],
    [0.0, '0.00'],
    [0.234, '0.23'],
    [0.239, '0.24'],
    [0.999, '1.00'],
    [1, '1.00'],
    [1.0, '1.00'],
    [1.999, '2.00'],
    [9999, '9,999.00'],
    [9999999, '9,999,999.00'],
    [9999999.998, '10,000,000.00'],
    ['', '0.00'],
    [' ', '0.00'],
    ['  ', '0.00'],
    ['.2', '0.20'],
    ['.234', '0.23'],
    ['.239', '0.24'],
    ['0', '0.00'],
    ['0.0', '0.00'],
    ['0.00', '0.00'],
    ['000', '0.00'],
    ['0.999', '1.00'],
    ['1', '1.00'],
    ['01', '1.00'],
    ['1.0', '1.00'],
    ['01.0', '1.00'],
    ['1.999', '2.00'],
    ['01.999', '2.00'],
    ['9999', '9,999.00'],
    ['9999999', '9,999,999.00'],
    ['9999999.999', '10,000,000.00'],
  ])(
    'should convert a value as expected (value=%s)',
    (value: string | number, expected: string) => {
      const actual = formatMoney(value);
      expect(actual).toEqual(expected);
    },
  );

  it.each([
    ['_'],
    ['$'],
    ['1a'],
    ['1a1'],
    ['$1'],
    ['$1.00'],
    ['1,11,1'],
    ['11,11'],
    [',100'],
    ['$.100'],
    ['1.000,00'],
  ])(
    'should throw an error if value cannot be parsed to a number (value=%s)',
    (value: string) => {
      expect(() => formatMoney(value)).toThrowError(/Unable to convert value:/);
    },
  );
});
