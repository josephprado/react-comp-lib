import { describe, expect, it } from 'vitest';
import { Criteria, validateString } from './validate-string';

describe(validateString.name, () => {
  it.each([
    ['', [], true],
    ['a', [{ test: /./, name: '' }], true],
    ['aa', [{ test: /^.{2}$/, name: '' }], true],
    ['aa', [{ test: (x: string) => !!x.length, name: '' }], true],
    [
      '123',
      [
        { test: /[\d]*/, name: '' },
        { test: (x: string) => Number(x) === 123, name: '' },
      ],
      true,
    ],
  ])(
    'should return null when the string is valid',
    (str: string, criteria: Criteria[], expected: boolean) => {
      const isValid = validateString({ str, criteria }) === null;
      expect(isValid).toEqual(expected);
    },
  );

  it.each([
    ['aa', [{ test: /^.{3}$/, name: 'length=3' }], ['length=3']],
    [
      '',
      [{ test: (x: string) => !!x.length, name: 'not empty' }],
      ['not empty'],
    ],
    [
      '123a',
      [
        { test: /^[\d]*$/, name: 'only digits' },
        { test: (x: string) => Number(x) === 123, name: 'valid number' },
      ],
      ['only digits', 'valid number'],
    ],
    [
      '123',
      [
        { test: /^[\d]*$/, name: 'only digits' },
        {
          test: (x: string) => x.substring(0, 1) === 'a',
          name: 'begins with a',
        },
      ],
      ['begins with a'],
    ],
  ])(
    'should return a list of the criteria names that failed',
    (str: string, criteria: Criteria[], expected: string[]) => {
      const errors = validateString({ str, criteria });
      expect(errors).toEqual(expected);
    },
  );

  it.each([
    [
      'aa',
      [
        { test: /^.{3}$/, name: 'length=3', stopOnFail: true },
        { test: /^.{4}$/, name: 'length=4' },
      ],
      ['length=3'],
    ],
    [
      '',
      [
        {
          test: (x: string) => !!x.length,
          name: 'not empty',
          stopOnFail: true,
        },
        { test: (x: string) => x === '', name: 'is blank' },
        { test: (x: string) => x === 'b', name: 'is b' },
      ],
      ['not empty'],
    ],
    [
      '123',
      [
        { test: /^[\d]*$/, name: 'only digits', stopOnFail: true },
        {
          test: (x: string) => Number(x) === 123,
          name: 'valid number',
          stopOnFail: true,
        },
        {
          test: (x: string) => x.substring(0, 1) === '2',
          name: 'begins with 2',
          stopOnFail: true,
        },
        {
          test: (x: string) => x.substring(0, 1) === '1',
          name: 'begins with 1',
        },
      ],
      ['begins with 2'],
    ],
    [
      '123',
      [
        { test: /^[a-zA-Z]*$/, name: 'only letters', stopOnFail: false },
        {
          test: (x: string) => x.length === 4,
          name: 'length=4',
        },
        {
          test: (x: string) => x.substring(0, 1) === '2',
          name: 'begins with 2',
          stopOnFail: true,
        },
        {
          test: (x: string) => x.substring(0, 1) === 'a',
          name: 'begins with a',
        },
      ],
      ['only letters', 'length=4', 'begins with 2'],
    ],
  ])(
    'should stop at the first stopOnFail criteria that fails',
    (str: string, criteria: Criteria[], expected: string[]) => {
      const errors = validateString({ str, criteria });
      expect(errors).toEqual(expected);
    },
  );

  it.each([
    ['a', [{ test: (_x: string) => true, name: '' }], false],
    ['a ', [{ test: (_x: string) => true, name: '' }], false],
    [' a', [{ test: (_x: string) => true, name: '' }], false],
    [' a ', [{ test: (_x: string) => true, name: '' }], false],
    ['', [{ test: (_x: string) => true, name: '' }], true],
    [' ', [{ test: (_x: string) => true, name: '' }], true],
    ['  ', [{ test: (_x: string) => true, name: '' }], true],
  ])(
    'should test for non-empty strings when notEmpty prop is true',
    (str: string, criteria: Criteria[], isEmpty: boolean) => {
      const empty = validateString({ str, criteria, notEmpty: true }) !== null;
      expect(empty).toEqual(isEmpty);
    },
  );
});
