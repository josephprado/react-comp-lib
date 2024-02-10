/**
 * Defines a rule that a valid string must satisfy.
 */
export interface Criteria {
  /**
   * A test to identify a valid string.
   */
  test: RegExp | ((x: string) => boolean);

  /**
   * The name of the criteria.
   */
  name: string;

  /**
   * If true, when this criteria's test fails, any criteria subsequent to this
   * one will be skipped for testing.
   */
  stopOnFail?: boolean;
}

/**
 * Props for the {@link validateString} function.
 */
export interface ValidateStringProps {
  /**
   * The string to validate.
   */
  str: string;

  /**
   * A list of {@link Criteria} that `str` must satisfy.
   */
  criteria: Criteria[];

  /**
   * If true, adds a criteria that checks that `str` is not empty whitespace.
   * If this criteria fails, all remaining criteria are skipped.
   */
  notEmpty?: boolean;
}

/**
 * Validates the given string against a list of criteria.
 *
 * @param props {@link ValidateStringProps}
 * @returns A list of criteria the string violates, or null if it passes all
 *          the given criteria.
 */
export function validateString({
  str,
  criteria,
  notEmpty,
}: ValidateStringProps): string[] | null {
  const criteriaList: Criteria[] = notEmpty
    ? [
        {
          test: (x) => !!x?.trim().length,
          name: 'not be empty',
          stopOnFail: true,
        },
        ...criteria,
      ]
    : criteria;

  const errors: string[] = [];

  for (const { test, name, stopOnFail } of criteriaList) {
    if (
      (typeof test === 'function' && !test(str)) ||
      (test instanceof RegExp && !test.test(str))
    ) {
      errors.push(name);
      if (stopOnFail) break;
    }
  }

  return errors.length ? errors : null;
}
