/**
 * Formats the given string into a USA telephone number (without country code).
 * Any non-digit characters will be removed. If the string contains more than
 * 10 digits, the excess digits will be marked as an extension (ext.), unless
 * `noExtension` is set to true.
 *
 * @example
 * ```
 * formatTelUSA('1234567890'); // (123) 456-7890
 * formatTelUSA('123-456-7890'); // (123) 456-7890
 * formatTelUSA('1234567890987'); // (123) 456-7890 ext. 987
 * formatTelUSA('1234567890987', true); // (123) 456-7890
 * ```
 * @param str A string to format as a telephone number.
 * @param noExtension If true, ignores digits after the first 10.
 * @returns A string formatted as a USA telephone number.
 */
export function formatTelUSA(str: string, noExtension?: boolean) {
  const digits = str.replace(/\D/g, '').trim();
  const length = digits.length;
  let phone = noExtension ? digits.substring(0, 10) : digits;

  if (length > 3)
    phone = '(' + phone.substring(0, 3) + ') ' + phone.substring(3);

  if (length > 6) phone = phone.substring(0, 9) + '-' + phone.substring(9);

  if (!noExtension && length > 10)
    phone = phone.substring(0, 14) + ' ext. ' + phone.substring(14);

  return phone;
}
