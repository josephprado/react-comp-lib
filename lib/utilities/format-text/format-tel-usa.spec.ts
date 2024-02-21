import { describe, expect, it } from 'vitest';
import { formatTelUSA } from './format-tel-usa';

describe(formatTelUSA.name, () => {
  it.each([
    ['1234567890', undefined, '(123) 456-7890'],
    ['1234567890', false, '(123) 456-7890'],
    ['1234567890', true, '(123) 456-7890'],

    ['1234567890987', undefined, '(123) 456-7890 ext. 987'],
    ['1234567890987', false, '(123) 456-7890 ext. 987'],
    ['1234567890987', true, '(123) 456-7890'],

    ['123 456 7890 987', undefined, '(123) 456-7890 ext. 987'],
    ['123 456 7890 987', false, '(123) 456-7890 ext. 987'],
    ['123 456 7890 987', true, '(123) 456-7890'],

    ['(123)456-7890 x987', undefined, '(123) 456-7890 ext. 987'],
    ['(123)456-7890 x987', false, '(123) 456-7890 ext. 987'],
    ['(123)456-7890 x987', true, '(123) 456-7890'],

    ['123-456-7890-987', undefined, '(123) 456-7890 ext. 987'],
    ['123-456-7890-987', false, '(123) 456-7890 ext. 987'],
    ['123-456-7890-987', true, '(123) 456-7890'],

    ['123.456.7890.987', undefined, '(123) 456-7890 ext. 987'],
    ['123.456.7890.987', false, '(123) 456-7890 ext. 987'],
    ['123.456.7890.987', true, '(123) 456-7890'],

    ['123$456#7890>987', undefined, '(123) 456-7890 ext. 987'],
    ['123$456#7890>987', false, '(123) 456-7890 ext. 987'],
    ['123$456#7890>987', true, '(123) 456-7890'],

    [' 1 2 3 4 5 6 7 8 9 0 9 8 7 ', undefined, '(123) 456-7890 ext. 987'],
    [' 1 2 3 4 5 6 7 8 9 0 9 8 7 ', false, '(123) 456-7890 ext. 987'],
    [' 1 2 3 4 5 6 7 8 9 0 9 8 7 ', true, '(123) 456-7890'],

    ['foo1!2ba3 ~ rba 4 z 5678bat908  _9', undefined, '(123) 456-7890 ext. 89'],
    ['foo1!2ba3 ~ rba 4 z 5678bat908  _9', false, '(123) 456-7890 ext. 89'],
    ['foo1!2ba3 ~ rba 4 z 5678bat908  _9', true, '(123) 456-7890'],
  ])(
    'should convert a string as expected (str=%s, noExt=%s)',
    (str: string, noExtension: boolean | undefined, expected: string) => {
      const actual = formatTelUSA(str, noExtension);
      expect(actual).toEqual(expected);
    },
  );
});
