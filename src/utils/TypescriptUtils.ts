export type Replace<
  Original extends object,
  Specific extends Partial<Record<keyof Original, unknown>>,
> = Omit<Original, keyof Specific> & Specific;

export type NonEmptyArray<T> = [T, ...T[]];

export function validateNotEmpty<T>(input: unknown): NonEmptyArray<T> {
  const isNotEmpty = <T>(input: unknown): input is NonEmptyArray<T> =>
    Array.isArray(input) && input.length > 0;

  if (isNotEmpty<T>(input)) {
    return input;
  }

  throw new Error('Expecting a non-empty array');
}
